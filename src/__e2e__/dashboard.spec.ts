import { test, expect } from '@playwright/test';

// Simula uno stato loggato iniettando il valore Pinia in localStorage
// (pinia-plugin-persistedstate usa la chiave uguale al nome dello store)
const loggedInState = JSON.stringify({
  uid: 'test-uid-123',
  displayName: 'Mario Rossi',
  email: 'mario@test.it',
  quizHistory: [],
});

test.describe('Dashboard — Calcolatore CO₂', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((state) => {
      localStorage.setItem('user', state);
    }, loggedInState);

    await page.goto('/dashboard');
  });

  test('mostra il titolo e il form del calcolatore', async ({ page }) => {
    await expect(page.getByText('Emissioni di CO₂')).toBeVisible();
    await expect(page.getByLabel("Digita l'indirizzo di partenza")).toBeVisible();
    await expect(page.getByLabel("Digita l'indirizzo di arrivo")).toBeVisible();
    await expect(page.getByLabel('Che mezzo usi?')).toBeVisible();
  });

  test('il bottone Calcola è disabilitato senza indirizzi e mezzo', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Calcola' })).toBeDisabled();
  });

  test('la select tipo/dimensione auto è disabilitata se il mezzo non è auto', async ({ page }) => {
    const mezzoSelect = page.getByLabel('Che mezzo usi?');
    await mezzoSelect.click();
    await page.getByRole('option', { name: 'Treno' }).click();

    await expect(page.getByLabel('Che tipo di auto hai?')).toBeDisabled();
    await expect(page.getByLabel('Che dimensioni ha la tua auto?')).toBeDisabled();
  });

  test('la select tipo/dimensione auto è abilitata se il mezzo è auto', async ({ page }) => {
    const mezzoSelect = page.getByLabel('Che mezzo usi?');
    await mezzoSelect.click();
    await page.getByRole('option', { name: 'Auto' }).click();

    await expect(page.getByLabel('Che tipo di auto hai?')).toBeEnabled();
    await expect(page.getByLabel('Che dimensioni ha la tua auto?')).toBeEnabled();
  });

  test('la ricerca indirizzi mostra suggerimenti dopo 3 caratteri', async ({ page }) => {
    // Intercetta la chiamata Nominatim e restituisce dati fake
    await page.route('**/nominatim.openstreetmap.org/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { display_name: 'Milano, Lombardia, Italia', lat: '45.4642', lon: '9.1900' },
          { display_name: 'Milano Centrale, Milano, Italia', lat: '45.4855', lon: '9.2045' },
        ]),
      });
    });

    await page.getByLabel("Digita l'indirizzo di partenza").fill('Mil');
    await expect(page.getByRole('option', { name: 'Milano, Lombardia, Italia' })).toBeVisible({ timeout: 2000 });
  });

  test('mostra il risultato dopo il calcolo', async ({ page }) => {
    await page.route('**/nominatim.openstreetmap.org/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { display_name: 'Milano, Lombardia, Italia', lat: '45.4642', lon: '9.1900' },
        ]),
      });
    });

    await page.route('**/openrouteservice.org/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          routes: [{ summary: { distance: 300000 } }], // 300 km in metri
        }),
      });
    });

    // Seleziona partenza
    const startInput = page.getByLabel("Digita l'indirizzo di partenza");
    await startInput.fill('Mil');
    await page.getByRole('option', { name: 'Milano, Lombardia, Italia' }).click();

    // Seleziona arrivo (stessa mock)
    const endInput = page.getByLabel("Digita l'indirizzo di arrivo");
    await endInput.fill('Mil');
    await page.getByRole('option', { name: 'Milano, Lombardia, Italia' }).click();

    // Seleziona mezzo
    await page.getByLabel('Che mezzo usi?').click();
    await page.getByRole('option', { name: 'Auto' }).click();

    await page.getByRole('button', { name: 'Calcola' }).click();

    await expect(page.getByText(/km.*CO₂|CO₂.*km/i)).toBeVisible({ timeout: 5000 });
  });
});
