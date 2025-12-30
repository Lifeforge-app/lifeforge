import fs from 'fs'

import { confirmAction, executeCommand } from '@/utils/helpers'
import CLILoggingService from '@/utils/logging'

import { type CommitInfo, checkForUpdates } from '../functions/git'
import { getInstalledModules, moduleExists } from '../utils/file-system'

async function updateSingleModule(moduleName: string): Promise<void> {
  CLILoggingService.step(`Checking for updates in module: ${moduleName}`)

  const availableUpdates: CommitInfo[] = await checkForUpdates(moduleName)

  if (availableUpdates.length === 0) {
    CLILoggingService.info(`Module "${moduleName}" is already up to date`)

    return
  }

  CLILoggingService.info(
    `Found ${availableUpdates.length} new commit(s) for "${moduleName}":`
  )
  CLILoggingService.newline()

  availableUpdates.forEach((commit, index) => {
    console.log(
      `  ${(index + 1).toString().padStart(2)}. ${commit.hash} - ${commit.message}`
    )
  })

  CLILoggingService.newline()

  const shouldUpdate = await confirmAction(
    `Do you want to update module "${moduleName}"?`
  )

  if (!shouldUpdate) {
    CLILoggingService.info(`Skipping update for module "${moduleName}"`)

    return
  }

  CLILoggingService.progress(`Updating module: ${moduleName}`)

  try {
    executeCommand(
      `cd apps/${moduleName} && git pull origin main && bun install --linker isolated`
    )

    if (fs.existsSync(`apps/${moduleName}/server/schema.ts`)) {
      executeCommand(`bun forge db push ${moduleName}`)
    }

    CLILoggingService.success(`Successfully updated module: ${moduleName}`)
  } catch (error) {
    CLILoggingService.error(`Failed to update module "${moduleName}": ${error}`)
  }
}

export async function updateModuleHandler(moduleName?: string): Promise<void> {
  if (!moduleName) {
    const modules = getInstalledModules()

    if (modules.length === 0) {
      CLILoggingService.info('No modules installed to update')

      return
    }

    for (const mod of modules) {
      await updateSingleModule(mod)

      if (mod !== modules[modules.length - 1]) {
        CLILoggingService.newline()
      }
    }

    return
  }

  if (!moduleExists(moduleName)) {
    CLILoggingService.actionableError(
      `Module "${moduleName}" does not exist in workspace`,
      'Use "bun forge module list" to see available modules'
    )
    process.exit(1)
  }

  await updateSingleModule(moduleName)
}
