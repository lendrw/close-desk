import { expect, test } from '@playwright/test'

test('validates first access flow', async ({ page }) => {
  const uniqueSuffix = Date.now()
  const user = {
    email: `ada.${uniqueSuffix}@example.com`,
    name: 'Ada Lovelace',
    password: 'securepass123',
  }

  await page.goto('/dashboard')

  await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible()

  await page.getByRole('link', { name: 'Criar conta' }).click()

  await page.getByLabel('Nome').fill(user.name)
  await page.getByLabel('E-mail').fill(user.email)
  await page.getByLabel('Senha').fill(user.password)
  await page.getByRole('button', { name: 'Criar conta' }).click()

  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  await expect(page.getByText(user.name)).toBeVisible()
  await expect(page.getByText('E-mail pendente')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Chamados' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Novo chamado' })).toBeVisible()
})
