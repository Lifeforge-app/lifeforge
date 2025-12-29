import chalk from 'chalk'
import fs from 'fs'
import type PocketBase from 'pocketbase'

import { executeCommand } from '@/utils/helpers'
import CLILoggingService from '@/utils/logging'
import getPBInstance from '@/utils/pocketbase'

import { getInstalledLocales, localeExists, validateLocaleName } from '../utils'

/**
 * Updates users' language preferences when a locale is being removed
 */
async function updateUsersLanguage(
  pb: PocketBase,
  fromLang: string,
  toLang: string
): Promise<number> {
  const users = await pb.collection('users').getFullList({
    filter: `language = "${fromLang}"`
  })

  if (users.length === 0) {
    return 0
  }

  CLILoggingService.progress(
    `Updating ${users.length} user(s) from "${fromLang}" to "${toLang}"`
  )

  for (const user of users) {
    await pb.collection('users').update(user.id, { language: toLang })
  }

  return users.length
}

/**
 * Removes the git submodule for a locale
 */
function removeGitSubmodule(localeDir: string): void {
  CLILoggingService.progress('Removing git submodule')

  // Step 1: Deinitialize the submodule
  try {
    executeCommand(`git submodule deinit -f ${localeDir}`, {
      exitOnError: false,
      stdio: ['ignore', 'ignore', 'ignore']
    })
  } catch {
    // May fail if not a proper submodule
  }

  // Step 2: Remove from git index (git rm)
  try {
    executeCommand(`git rm -rf ${localeDir}`, {
      exitOnError: false,
      stdio: ['ignore', 'ignore', 'ignore']
    })
  } catch {
    // May fail if not tracked
  }

  // Step 3: Force remove from git index (handles orphaned entries)
  try {
    executeCommand(`git update-index --force-remove ${localeDir}`, {
      exitOnError: false,
      stdio: ['ignore', 'ignore', 'ignore']
    })
  } catch {
    // May fail if not in index
  }

  // Step 4: Remove from .git/modules
  const gitModulesPath = `.git/modules/${localeDir}`

  if (fs.existsSync(gitModulesPath)) {
    fs.rmSync(gitModulesPath, { recursive: true })
  }

  // Step 5: Remove entry from .gitmodules file
  if (fs.existsSync('.gitmodules')) {
    const content = fs.readFileSync('.gitmodules', 'utf-8')

    const lines = content.split('\n')

    const filteredLines: string[] = []

    let skipSection = false

    for (const line of lines) {
      if (line.startsWith('[submodule')) {
        skipSection = line.includes(`"${localeDir}"`)
      }

      if (!skipSection) {
        filteredLines.push(line)
      }
    }

    fs.writeFileSync('.gitmodules', filteredLines.join('\n').trim() + '\n')

    try {
      executeCommand('git add .gitmodules', {
        exitOnError: false,
        stdio: ['ignore', 'ignore', 'ignore']
      })
    } catch {
      // Ignore
    }
  }

  CLILoggingService.success('Git submodule removed successfully')
}

/**
 * Cleans up locale directory if it still exists
 */
function cleanupLocaleDir(localeDir: string): void {
  if (fs.existsSync(localeDir)) {
    fs.rmSync(localeDir, { recursive: true })
  }
}

/**
 * Handles removing a locale from the LifeForge system
 */
export async function removeLocaleHandler(langName: string): Promise<void> {
  if (!validateLocaleName(langName)) {
    CLILoggingService.actionableError(
      'Invalid language name format',
      'Use formats like "en", "ms", "zh-CN", "zh-TW"'
    )
    process.exit(1)
  }

  if (!localeExists(langName)) {
    CLILoggingService.actionableError(
      `Language "${langName}" is not installed`,
      'Use "bun forge locales list" to see installed languages'
    )
    process.exit(1)
  }

  const installedLocales = getInstalledLocales()

  if (installedLocales.length <= 1) {
    CLILoggingService.actionableError(
      'Cannot remove the last installed language',
      'At least one language must remain installed'
    )
    process.exit(1)
  }

  CLILoggingService.step(`Removing language pack: ${langName}`)

  const { pb, killPB } = await getPBInstance()

  try {
    const remainingLocales = installedLocales.filter(l => l !== langName)

    const fallbackLang = remainingLocales[0]

    const affectedUsers = await updateUsersLanguage(pb, langName, fallbackLang)

    if (affectedUsers > 0) {
      CLILoggingService.info(
        `Updated ${chalk.bold.blue(affectedUsers)} user(s) to "${fallbackLang}"`
      )
    }

    const localeDir = `locales/${langName}`

    removeGitSubmodule(localeDir)
    cleanupLocaleDir(localeDir)

    CLILoggingService.success(
      `Language pack "${langName}" removed successfully! Restart the server to apply changes.`
    )
    killPB?.()
  } catch (error) {
    CLILoggingService.actionableError(
      'Locale removal failed',
      'Check the error details above and try again'
    )
    CLILoggingService.debug(`Removal error: ${error}`)
    killPB?.()

    process.exit(1)
  }
}
