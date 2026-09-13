import { expect, test } from '@playwright/test'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'

const screenshotDir = 'visual-results/screenshots'
const manifestPath = `${screenshotDir}/manifest.json`
const testUser = {
  email: 'visual-validation@example.com',
  name: 'Visual Validation',
  password: 'visual-validation-password',
  username: 'visualvalidation'
}

async function isVisible(locator) {
  return locator.isVisible().catch(() => false)
}

async function recordCapture(filename, description, capture, usable = true) {
  await capture()
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  manifest.captures.push({ filename, description, usable })
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
}

async function setTheme(page, theme) {
  await page.goto('/personalization', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1_000)
  const themeButton = page
    .locator('button')
    .filter({ has: page.locator(`img[alt="${theme}"]`) })

  await expect(themeButton).toHaveCount(1)
  await themeButton.click()
  if (theme === 'dark') {
    await expect(page.locator('body')).toHaveClass(/dark/)
  } else {
    await expect(page.locator('body')).not.toHaveClass(/dark/)
  }
}

test.beforeAll(async () => {
  await rm(screenshotDir, { recursive: true, force: true })
  await mkdir(screenshotDir, { recursive: true })
  await writeFile(manifestPath, '{"captures":[]}\n')
})

test('validates notes module layout, modal creation, and URL persistence', async ({
  page
}) => {
  page.on('console', message => {
    if (message.type() === 'error' || message.type() === 'warning') {
      console.log(`[visual browser ${message.type()}] ${message.text()}`)
    }
  })
  page.on('pageerror', error => {
    console.log(`[visual page error] ${error.message}`)
  })
  page.on('response', response => {
    if (response.status() >= 400) {
      console.log(
        `[visual host response] ${response.status()} ${response.request().method()} ${response.url()}`
      )
    }
  })
  page.on('requestfailed', request => {
    console.log(
      `[visual request failed] ${request.failure()?.errorText || 'unknown'} ${request.url()}`
    )
  })

  await page.goto('/auth', { waitUntil: 'domcontentloaded' })

  const emailInput = page.getByPlaceholder('johndoe@gmail.com')
  const loginFormVisible = await emailInput
    .waitFor({ state: 'visible', timeout: 10_000 })
    .then(() => true)
    .catch(() => false)

  if (!loginFormVisible) {
    console.log('[visual] Login form not visible - API may be unavailable')
    await recordCapture(
      '00-notes-auth-error-state.png',
      'Authentication error state: login form unavailable (notes)',
      () =>
        page.screenshot({
          fullPage: true,
          path: `${screenshotDir}/00-notes-auth-error-state.png`
        }),
      false
    )
    throw new Error(
      'Visual validation not validated: authentication form was unavailable'
    )
  }

  const createAccountHeading = page.getByRole('heading', { name: 'Welcome!' })
  if (await isVisible(createAccountHeading)) {
    await page.getByPlaceholder('johndoe@gmail.com').fill(testUser.email)
    await page
      .getByPlaceholder('johndoe', { exact: true })
      .fill(testUser.username)
    await page.getByPlaceholder('John Doe').fill(testUser.name)
    await page
      .getByPlaceholder('Enter your password', { exact: true })
      .fill(testUser.password)
    await page
      .getByPlaceholder('Re-enter your password')
      .fill(testUser.password)
    await page.getByRole('button', { name: 'Proceed' }).click()
    await page.waitForTimeout(1_500)
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1_000)
  }

  await page.getByPlaceholder('johndoe@gmail.com').fill(testUser.email)
  await page.getByPlaceholder('••••••••••••••••').fill(testUser.password)
  await page.getByRole('button', { name: 'Sign In' }).click()

  const dashboardAppeared = await page
    .waitForURL(/\/dashboard/, { timeout: 10_000 })
    .then(() => true)
    .catch(() => false)

  if (!dashboardAppeared) {
    const currentUrl = page.url()
    const errorVisible = await page
      .locator('[class*="error"], [role="alert"]')
      .first()
      .textContent()
      .catch(() => null)
    const errorMsg = errorVisible ? ` Error: ${errorVisible}` : ''
    await recordCapture(
      '00-notes-login-failed.png',
      `Authentication failed: login did not reach the dashboard (${currentUrl})`,
      () =>
        page.screenshot({
          fullPage: true,
          path: `${screenshotDir}/00-notes-login-failed.png`
        }),
      false
    )
    throw new Error(
      `Visual validation not validated: login did not redirect to /dashboard.${errorMsg}`
    )
  }

  await setTheme(page, 'light')
  await page.goto('/notes', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1_000)

  const newNoteButton = page.getByRole('button', { name: /New note/ })
  await expect(newNoteButton).toBeVisible()

  const searchInput = page.getByPlaceholder('Search notes')
  const searchButton = page.getByRole('button', { name: 'Search' })
  await expect(searchInput).toBeVisible()
  await expect(searchButton).toBeVisible()

  await recordCapture(
    '01-notes-layout-light.png',
    'Notes module layout in light theme',
    () =>
      page.screenshot({
        fullPage: true,
        path: `${screenshotDir}/01-notes-layout-light.png`
      })
  )

  await expect(page.getByText('Select a note')).toBeVisible()

  await newNoteButton.click()
  const modalTitle = page.getByRole('heading', { name: 'New note' })
  await expect(modalTitle).toBeVisible()
  await expect(page.getByLabel('Title')).toBeVisible()
  await expect(page.getByPlaceholder('Write your note...')).toBeVisible()

  await recordCapture(
    '02-notes-create-modal-light.png',
    'Notes create modal in light theme',
    () =>
      page.screenshot({
        fullPage: true,
        path: `${screenshotDir}/02-notes-create-modal-light.png`
      })
  )

  await page.getByLabel('Title').fill('Test Note Title')
  await page.getByPlaceholder('Write your note...').fill('Test note content body')
  await page.getByRole('button', { name: 'Create' }).click()

  await expect(page.getByText('Test Note Title')).toBeVisible()

  await recordCapture(
    '03-notes-after-create-light.png',
    'Notes list after creating a note in light theme',
    () =>
      page.screenshot({
        fullPage: true,
        path: `${screenshotDir}/03-notes-after-create-light.png`
      })
  )

  await page.getByText('Test Note Title').click()
  await expect(
    page.getByRole('article').getByText('Test note content body')
  ).toBeVisible()

  await recordCapture(
    '04-notes-selected-light.png',
    'Notes detail view in light theme',
    () =>
      page.screenshot({
        fullPage: true,
        path: `${screenshotDir}/04-notes-selected-light.png`
      })
  )

  const url = page.url()
  expect(url).toMatch(/[?&]note=/)

  await searchInput.fill('search term')
  await page.waitForTimeout(500)
  const urlAfterSearch = page.url()
  expect(urlAfterSearch).toMatch(/[?&]q=search/)

  await searchInput.fill('')
  await expect(
    page.getByRole('button', { name: 'Test Note Title Test note' })
  ).toBeVisible()

  const editButton = page.getByRole('button', { name: 'Edit Test Note Title' })
  await expect(editButton).toBeVisible()
  await editButton.click()
  await expect(page.getByRole('heading', { name: 'Edit note' })).toBeVisible()

  await recordCapture(
    '05-notes-edit-modal-light.png',
    'Notes edit modal in light theme',
    () =>
      page.screenshot({
        fullPage: true,
        path: `${screenshotDir}/05-notes-edit-modal-light.png`
      })
  )

  await page.keyboard.press('Escape')
  await page.waitForTimeout(500)

  await setTheme(page, 'dark')
  await page.goto('/notes', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1_000)

  await expect(newNoteButton).toBeVisible()
  await recordCapture(
    '06-notes-layout-dark.png',
    'Notes module layout in dark theme',
    () =>
      page.screenshot({
        fullPage: true,
        path: `${screenshotDir}/06-notes-layout-dark.png`
      })
  )

  await newNoteButton.click()
  await expect(modalTitle).toBeVisible()
  await recordCapture(
    '07-notes-create-modal-dark.png',
    'Notes create modal in dark theme',
    () =>
      page.screenshot({
        fullPage: true,
        path: `${screenshotDir}/07-notes-create-modal-dark.png`
      })
  )
})
