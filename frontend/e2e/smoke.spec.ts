import { expect, test } from '@playwright/test'

test('renders the home page', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'CloseDesk' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Entrar' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Criar conta' })).toBeVisible()
})

test('keeps the home card centered on small viewports', async ({ page }) => {
  await page.setViewportSize({ height: 670, width: 355 })
  await page.goto('/')

  const card = page.locator('.app-card')
  const cardBox = await card.boundingBox()

  expect(cardBox).not.toBeNull()

  if (!cardBox) {
    return
  }

  const overflow = await page.evaluate(() => {
    const documentElement = document.documentElement
    const body = document.body

    return {
      horizontal:
        Math.max(documentElement.scrollWidth, body.scrollWidth) >
        window.innerWidth,
      vertical:
        Math.max(documentElement.scrollHeight, body.scrollHeight) >
        window.innerHeight,
    }
  })

  expect(cardBox.height).toBeLessThan(420)
  expect(cardBox.y).toBeGreaterThan(40)
  expect(overflow.horizontal).toBe(false)
  expect(overflow.vertical).toBe(false)
})
