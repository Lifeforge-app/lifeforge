import { expect, test } from '@playwright/test'
import { mkdir, readFile, writeFile } from 'node:fs/promises'

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
  await mkdir(screenshotDir, { recursive: true })
  try {
    await readFile(manifestPath, 'utf8')
  } catch {
    await writeFile(manifestPath, '{"captures":[]}\n')
  }
})

test('captures the To-Do List layout in both themes', async ({ page }) => {
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
      '00-auth-error-state.png',
      'Authentication error state: login form unavailable',
      () =>
        page.screenshot({
          fullPage: true,
          path: `${screenshotDir}/00-auth-error-state.png`
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
      '00-login-failed.png',
      `Authentication failed: login did not reach the dashboard (${currentUrl})`,
      () =>
        page.screenshot({
          fullPage: true,
          path: `${screenshotDir}/00-login-failed.png`
        }),
      false
    )
    throw new Error(
      `Visual validation not validated: login did not redirect to /dashboard.${errorMsg}`
    )
  }

  await setTheme(page, 'dark')
  await page.goto('/todo-list', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1_000)
  await expect(page.getByRole('heading', { name: /All Tasks/ })).toBeVisible()

  const taskSummary = `Visual validation task ${Date.now()}`
  await page.getByRole('button', { name: /New Task/ }).click()
  await expect(page.getByText('Include Time')).toBeVisible()
  await page.getByPlaceholder('An urgent task').fill(taskSummary)
  await page.getByRole('button', { name: 'Create' }).click()
  await expect(page.getByText(taskSummary)).toBeVisible()

  await recordCapture(
    '01-task-list-dark.png',
    'To-Do List task list in dark theme with a created task',
    () =>
      page.screenshot({
        fullPage: true,
        path: `${screenshotDir}/01-task-list-dark.png`
      })
  )
  await recordCapture(
    '02-sidebar-dark.png',
    'To-Do List module sidebar in dark theme',
    () =>
      page
        .locator('aside')
        .nth(1)
        .screenshot({ path: `${screenshotDir}/02-sidebar-dark.png` })
  )

  await page.getByRole('button', { name: `Edit ${taskSummary}` }).click()
  await expect(page.getByText('Include Time')).toBeVisible()
  await recordCapture(
    '05-task-edit-drawer-dark.png',
    'To-Do List edit drawer in dark theme with the Include Time field',
    () =>
      page.screenshot({
        fullPage: true,
        path: `${screenshotDir}/05-task-edit-drawer-dark.png`
      })
  )

  await setTheme(page, 'light')
  await page.goto('/todo-list', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1_000)
  await expect(page.getByText(taskSummary)).toBeVisible()
  await recordCapture(
    '03-task-list-light.png',
    'To-Do List task list in light theme with a created task',
    () =>
      page.screenshot({
        fullPage: true,
        path: `${screenshotDir}/03-task-list-light.png`
      })
  )
  await recordCapture(
    '04-sidebar-light.png',
    'To-Do List module sidebar in light theme',
    () =>
      page
        .locator('aside')
        .nth(1)
        .screenshot({ path: `${screenshotDir}/04-sidebar-light.png` })
  )

  await page.getByRole('button', { name: `Edit ${taskSummary}` }).click()
  await expect(page.getByText('Include Time')).toBeVisible()
  await recordCapture(
    '06-task-edit-drawer-light.png',
    'To-Do List edit drawer in light theme with the Include Time field',
    () =>
      page.screenshot({
        fullPage: true,
        path: `${screenshotDir}/06-task-edit-drawer-light.png`
      })
  )
})
