import { test, expect } from '@playwright/test';

const loggedInState = JSON.stringify({
  uid: 'test-uid-123',
  displayName: 'Mario Rossi',
  email: 'mario@test.it',
  quizHistory: [],
});

const mockQuestions = JSON.stringify({
  questions: [
    {
      id: 'q1',
      question: 'Qual è la principale causa del cambiamento climatico?',
      answer: 0,
      options: [
        { text: 'Deforestazione', value: 0 },
        { text: 'Agricoltura biologica', value: 1 },
        { text: 'Energia solare', value: 2 },
      ],
    },
    {
      id: 'q2',
      question: 'Quale gas è il principale responsabile dell\'effetto serra?',
      answer: 1,
      options: [
        { text: 'Ossigeno', value: 0 },
        { text: 'Anidride carbonica', value: 1 },
        { text: 'Azoto', value: 2 },
      ],
    },
  ],
});

test.describe('Assessment — Quiz', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(({ user, questions }) => {
      localStorage.setItem('user', user);
      localStorage.setItem('questions', questions);
    }, { user: loggedInState, questions: mockQuestions });

    await page.goto('/assessment');
  });

  test('mostra il titolo della pagina', async ({ page }) => {
    await expect(page.getByText('Quante ne sai?')).toBeVisible();
  });

  test('mostra il bottone per iniziare il quiz', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Inizia il quiz' })).toBeVisible();
  });

  test('avvia il quiz al click del bottone', async ({ page }) => {
    await page.getByRole('button', { name: 'Inizia il quiz' }).click();
    await expect(page.getByText('Domanda 1 /')).toBeVisible();
  });

  test('permette di rispondere e avanzare alla domanda successiva', async ({ page }) => {
    await page.getByRole('button', { name: 'Inizia il quiz' }).click();

    await expect(page.getByText('Domanda 1 /')).toBeVisible();

    // Seleziona la prima opzione
    await page.getByRole('radio').first().click();
    await expect(page.getByRole('button', { name: 'Avanti' })).toBeEnabled();

    await page.getByRole('button', { name: 'Avanti' }).click();
    await expect(page.getByText('Domanda 2 /')).toBeVisible();
  });

  test('il bottone Avanti è disabilitato senza risposta selezionata', async ({ page }) => {
    await page.getByRole('button', { name: 'Inizia il quiz' }).click();
    await expect(page.getByRole('button', { name: 'Avanti' })).toBeDisabled();
  });

  test('mostra il risultato al termine del quiz', async ({ page }) => {
    // Intercetta il salvataggio su Firestore
    await page.route('**/firestore.googleapis.com/**', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ name: 'fake-doc-id' }) });
    });

    await page.getByRole('button', { name: 'Inizia il quiz' }).click();

    // Risponde a tutte le domande
    for (let i = 0; i < 2; i++) {
      await page.getByRole('radio').first().click();
      await page.getByRole('button', { name: 'Avanti' }).click();
    }

    await expect(page.getByText(/Hai risposto correttamente/)).toBeVisible({ timeout: 5000 });
  });
});
