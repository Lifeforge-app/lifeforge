import chalk from 'chalk'
import fs from 'fs'

import { executeCommand } from '@/utils/helpers'
import CLILoggingService from '@/utils/logging'
import getPBInstance from '@/utils/pocketbase'

import {
  type LocaleInstallConfig,
  createLocaleConfig,
  getInstalledLocales,
  localeExists,
  validateLocaleName
} from '../utils'

const LOCALE_STRUCTURE_REQUIREMENTS = ['manifest.json']

/**
 * Removes path from git index if it exists but is not a submodule
 * This handles the case where locale directories were previously tracked directly
 */
function removeFromGitIndex(localeDir: string): void {
  try {
    executeCommand(`git rm -r --cached --ignore-unmatch ${localeDir}`, {
      exitOnError: false,
      stdio: ['ignore', 'ignore', 'ignore']
    })
  } catch {
    // Ignore errors, path may not exist in index
  }
}

/**
 * Clones locale repository from GitHub as a submodule
 */
function cloneLocaleRepository(config: LocaleInstallConfig): void {
  if (!fs.existsSync('.gitmodules')) {
    fs.writeFileSync('.gitmodules', '')
  }

  CLILoggingService.progress('Cloning locale repository from GitHub')

  // Remove from git index if it was previously tracked (not as submodule)
  removeFromGitIndex(config.localeDir)

  try {
    executeCommand(
      `git submodule add --force ${config.repoUrl} ${config.localeDir}`,
      {
        exitOnError: false,
        stdio: ['ignore', 'ignore', 'ignore']
      }
    )

    CLILoggingService.success('Repository cloned successfully')
  } catch (error) {
    CLILoggingService.actionableError(
      'Failed to clone locale repository',
      `Verify the repository lifeforge-app/lang-${config.langName} exists and is accessible`
    )
    throw error
  }
}

/**
 * Validates the locale structure
 */
function validateLocaleStructure(config: LocaleInstallConfig): void {
  CLILoggingService.step('Validating locale structure')

  const missingFiles = LOCALE_STRUCTURE_REQUIREMENTS.filter(
    file => !fs.existsSync(`${config.localeDir}/${file}`)
  )

  if (missingFiles.length > 0) {
    CLILoggingService.actionableError(
      'Invalid locale structure detected',
      `Missing required files: ${missingFiles.join(', ')}`
    )
    throw new Error('Invalid locale structure')
  }

  CLILoggingService.success('Locale structure validated')
}

/**
 * Updates git submodules
 */
function updateGitSubmodules(): void {
  CLILoggingService.progress('Updating git submodules')

  try {
    executeCommand('git submodule update --init --recursive --remote', {
      stdio: ['ignore', 'ignore', 'ignore'],
      exitOnError: false
    })
    CLILoggingService.success('Git submodules updated successfully')
  } catch (error) {
    CLILoggingService.actionableError(
      'Failed to update git submodules',
      'Check your git configuration and try again'
    )
    throw error
  }
}

/**
 * Cleans up on failure
 */
function cleanup(localeDir: string): void {
  if (fs.existsSync(localeDir)) {
    fs.rmSync(localeDir, { recursive: true })
  }
}

/**
 * Removes submodule entry from .gitmodules on failure
 */
function cleanupGitmodules(localeDir: string): void {
  if (!fs.existsSync('.gitmodules')) return

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
}

/**
 * Handles adding a new locale to the LifeForge system
 */
export async function addLocaleHandler(langName: string): Promise<void> {
  if (!validateLocaleName(langName)) {
    CLILoggingService.actionableError(
      'Invalid language name format',
      'Use formats like "en", "ms", "zh-CN", "zh-TW" (lowercase language code, optionally with uppercase region)'
    )
    process.exit(1)
  }

  if (localeExists(langName)) {
    CLILoggingService.actionableError(
      `Language "${langName}" is already installed`,
      'Use "bun forge locales list" to see installed languages'
    )
    process.exit(1)
  }

  const installedLocales = getInstalledLocales()

  const isFirstLocale = installedLocales.length === 0

  const config = createLocaleConfig(langName)

  CLILoggingService.step(`Adding language pack: ${langName}`)

  try {
    cloneLocaleRepository(config)
    validateLocaleStructure(config)
    updateGitSubmodules()

    executeCommand('git add .gitmodules')

    if (isFirstLocale) {
      CLILoggingService.step(
        'First language pack - setting as default for all users'
      )

      const { pb, killPB } = await getPBInstance()

      const users = await pb.collection('users').getFullList()

      for (const user of users) {
        await pb.collection('users').update(user.id, { language: langName })
      }

      CLILoggingService.info(
        `Set ${chalk.bold.blue(langName)} as default language for ${chalk.bold.blue(users.length)} user(s)`
      )

      killPB?.()
    }

    CLILoggingService.success(
      `Language pack "${langName}" installed successfully! Restart the server to apply changes.`
    )
  } catch (error) {
    CLILoggingService.actionableError(
      'Locale installation failed',
      'Check the error details above and try again'
    )
    CLILoggingService.debug(`Installation error: ${error}`)
    cleanup(config.localeDir)
    cleanupGitmodules(config.localeDir)
    process.exit(1)
  }
}
