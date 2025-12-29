import fs from 'fs'

import CLILoggingService from '@/utils/logging'
import { checkRunningPBInstances } from '@/utils/pocketbase'

import { cloneModuleRepository, updateGitSubmodules } from '../functions/git'
import { generateSchemaMigrations } from '../functions/migrations'
import {
  installDependencies,
  moveModuleToApps,
  processServerInjection,
  validateModuleStructure
} from '../functions/module-lifecycle'
import { cleanup, moduleExists } from '../utils/file-system'
import { createModuleConfig, validateRepositoryPath } from '../utils/validation'

export async function addModuleHandler(repoPath: string): Promise<void> {
  checkRunningPBInstances()

  if (!validateRepositoryPath(repoPath)) {
    CLILoggingService.actionableError(
      'Invalid module repository path format',
      'Use the format <author>/<module-name>, e.g., "lifeforge-app/wallet"'
    )
    process.exit(1)
  }

  const config = createModuleConfig(repoPath)

  CLILoggingService.step(`Adding module ${repoPath} from ${config.author}`)

  cleanup(config.tempDir)
  fs.mkdirSync(config.tempDir)

  try {
    if (moduleExists(config.moduleName)) {
      CLILoggingService.actionableError(
        `Module "${config.moduleName}" already exists in workspace`,
        `Remove it first with "bun forge module remove ${config.moduleName}" if you want to re-add it`
      )
      throw new Error('Module already exists')
    }

    cloneModuleRepository(config)
    validateModuleStructure(config)
    moveModuleToApps(config)
    updateGitSubmodules(`apps/${config.moduleName}`)
    processServerInjection(config.moduleName)
    installDependencies()

    if (fs.existsSync(`${config.moduleDir}/server/schema.ts`)) {
      generateSchemaMigrations(config.moduleName)
    }

    CLILoggingService.success(
      `Module ${repoPath} setup completed successfully! Start the system with "bun forge dev all"`
    )
    cleanup(config.tempDir)
  } catch (error) {
    CLILoggingService.actionableError(
      'Module installation failed',
      'Check the error details above and try again'
    )
    CLILoggingService.debug(`Installation error: ${error}`)
    cleanup(config.tempDir)
    process.exit(1)
  }
}
