import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
  });

  test('mostra il form di login', async ({ page }) => {
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Accedi' })).toBeVisible();
  });

  test('il bottone Accedi è disabilitato con form vuoto', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Accedi' })).toBeDisabled();
  });

  test('il bottone Accedi si abilita con dati validi', async ({ page }) => {
    await page.getByLabel('Email').fill('utente@test.it');
    await page.getByLabel('Password').fill('password123');
    await expect(page.getByRole('button', { name: 'Accedi' })).toBeEnabled();
  });

  test('mostra errore con credenziali non valide', async ({ page }) => {
    await page.getByLabel('Email').fill('errata@test.it');
    await page.getByLabel('Password').fill('passwordsbagliata');
    await page.getByRole('button', { name: 'Accedi' }).click();

    await expect(page.getByRole('status').or(page.getByRole('alert'))).toBeVisible({ timeout: 8000 });
  });

  test('il link Registrati porta alla pagina di registrazione', async ({ page }) => {
    await page.getByRole('link', { name: 'Registrati' }).click();
    await expect(page).toHaveURL('/auth/register');
  });

  test('il toggle mostra/nascondi password funziona', async ({ page }) => {
    const passwordField = page.getByLabel('Password');
    await passwordField.fill('secret');

    await expect(passwordField).toHaveAttribute('type', 'password');

    await page.getByRole('button', { name: 'Mostra password' }).click();
    await expect(passwordField).toHaveAttribute('type', 'text');

    await page.getByRole('button', { name: 'Nascondi password' }).click();
    await expect(passwordField).toHaveAttribute('type', 'password');
  });
});

test.describe('Registrazione', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/register');
  });

  test('mostra il form di registrazione completo', async ({ page }) => {
    await expect(page.getByLabel('Nome')).toBeVisible();
    await expect(page.getByLabel('Cognome')).toBeVisible();
    await expect(page.getByLabel('Email', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Ripeti Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByLabel('Conferma Password')).toBeVisible();
  });

  test('il bottone Registrati è disabilitato con form vuoto', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Registrati' })).toBeDisabled();
  });

  test('il link Accedi porta alla pagina di login', async ({ page }) => {
    await page.getByRole('link', { name: 'Accedi' }).click();
    await expect(page).toHaveURL('/auth/login');
  });
});
