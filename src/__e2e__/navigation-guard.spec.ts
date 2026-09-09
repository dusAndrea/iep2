import { test, expect } from '@playwright/test';

test.describe('Guard di navigazione', () => {
  test('utente non autenticato viene rediretto al login dalla home', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/auth/login');
  });

  test('utente non autenticato viene rediretto al login dalla dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/auth/login');
  });

  test('utente non autenticato viene rediretto al login da assessment', async ({ page }) => {
    await page.goto('/assessment');
    await expect(page).toHaveURL('/auth/login');
  });

  test('utente non autenticato viene rediretto al login da profile', async ({ page }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL('/auth/login');
  });

  test('utente non autenticato viene rediretto al login da wall', async ({ page }) => {
    await page.goto('/wall');
    await expect(page).toHaveURL('/auth/login');
  });

  test('rotta inesistente mostra pagina 404', async ({ page }) => {
    await page.goto('/questa-pagina-non-esiste');
    await expect(page.getByText('404 - Pagina non trovata')).toBeVisible();
  });
});
