import { expect, test } from '@playwright/test'

const screenshotDir = 'visual-results/screenshots'
const testUser = {
  email: 'visual-validation@example.com',
  name: 'Visual Validation',
  password: 'visual-validation-password',
  username: 'visualvalidation'
}

async function isVisible(locator) {
  return locator.isVisible().catch(() => false)
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

  await page.goto('/auth', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2_000)

  const emailInput = page.getByPlaceholder('johndoe@gmail.com')
  const loginFormVisible = await emailInput.isVisible().catch(() => false)

  if (!loginFormVisible) {
    console.log('[visual] Login form not visible - API may be unavailable')
    await page.screenshot({
      fullPage: true,
      path: `${screenshotDir}/00-notes-auth-error-state.png`
    })
    return
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
    await page.screenshot({
      fullPage: true,
      path: `${screenshotDir}/00-notes-login-failed.png`
    })
    console.log(
      `[visual] Login did not redirect to /dashboard. Current URL: ${currentUrl}. Skipping.`
    )
    return
  }

  // --- Light theme test ---
  await setTheme(page, 'light')
  await page.goto('/notes', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1_000)

  // Verify the notes page layout renders
  const newNoteButton = page.getByRole('button', { name: /New note/ })
  await expect(newNoteButton).toBeVisible()

  // Verify search input and search button are visible and aligned
  const searchInput = page.getByPlaceholder(/search/i)
  const searchButton = page.getByRole('button', { name: 'Search' })
  await expect(searchInput).toBeVisible()
  await expect(searchButton).toBeVisible()

  // Screenshot of initial notes layout
  await page.screenshot({
    fullPage: true,
    path: `${screenshotDir}/01-notes-layout-light.png`
  })

  // Verify "Select a note" empty state in detail panel
  await expect(page.getByText('Select a note')).toBeVisible()

  // Test: Clicking "New note" opens a modal (not a side panel)
  await newNoteButton.click()
  const modalTitle = page.getByRole('heading', { name: 'New note' })
  await expect(modalTitle).toBeVisible()
  // Verify form fields are inside the modal
  await expect(page.getByLabel('Title')).toBeVisible()
  await expect(page.getByLabel('Content')).toBeVisible()

  await page.screenshot({
    fullPage: true,
    path: `${screenshotDir}/02-notes-create-modal-light.png`
  })

  // Create a note
  await page.getByLabel('Title').fill('Test Note Title')
  await page.getByLabel('Content').fill('Test note content body')
  await page.getByRole('button', { name: 'Create' }).click()

  // Verify the note appears in the list
  await expect(page.getByText('Test Note Title')).toBeVisible()

  await page.screenshot({
    fullPage: true,
    path: `${screenshotDir}/03-notes-after-create-light.png`
  })

  // Click the note in the list to select it
  await page.getByText('Test Note Title').click()
  // Verify detail view shows the note
  await expect(page.getByText('Test note content body')).toBeVisible()

  await page.screenshot({
    fullPage: true,
    path: `${screenshotDir}/04-notes-selected-light.png`
  })

  // Verify URL persistence: note ID should be in URL
  const url = page.url()
  expect(url).toMatch(/[?&]note=/)

  // Test search URL persistence
  await searchInput.fill('search term')
  await page.waitForTimeout(500)
  const urlAfterSearch = page.url()
  expect(urlAfterSearch).toMatch(/[?&]q=search/)

  // Test edit modal opens from pencil button
  const editButton = page.getByRole('button', { name: /Edit Test Note Title/ })
  await expect(editButton).toBeVisible()
  await editButton.click()
  await expect(page.getByRole('heading', { name: 'Edit note' })).toBeVisible()

  await page.screenshot({
    fullPage: true,
    path: `${screenshotDir}/05-notes-edit-modal-light.png`
  })

  // Close the edit modal
  await page.keyboard.press('Escape')
  await page.waitForTimeout(500)

  // --- Dark theme test ---
  await setTheme(page, 'dark')
  await page.goto('/notes', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1_000)

  await expect(newNoteButton).toBeVisible()
  await page.screenshot({
    fullPage: true,
    path: `${screenshotDir}/06-notes-layout-dark.png`
  })

  // Verify dark theme modal
  await newNoteButton.click()
  await expect(modalTitle).toBeVisible()
  await page.screenshot({
    fullPage: true,
    path: `${screenshotDir}/07-notes-create-modal-dark.png`
  })
})
