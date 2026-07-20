import { expect, test } from '@playwright/test'

test('renders the home page', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'CloseDesk' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Entrar' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Criar conta' })).toBeVisible()
})
