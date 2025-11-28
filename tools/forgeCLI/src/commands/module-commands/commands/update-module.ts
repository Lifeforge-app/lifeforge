import fs from 'fs'

import {
  confirmAction,
  executeCommand,
  executeCommandWithOutput
} from '../../../utils/helpers'
import { CLILoggingService } from '../../../utils/logging'
import { getInstalledModules, moduleExists } from '../utils/file-system'

interface CommitInfo {
  hash: string
  message: string
}

async function checkForUpdates(modulePath: string): Promise<CommitInfo[]> {
  try {
    // Fetch latest changes from remote without pulling
    executeCommandWithOutput(`cd apps/${modulePath} && git fetch origin main`, {
      exitOnError: false
    })

    // Get commits between current HEAD and origin/main
    const output = executeCommandWithOutput(
      `cd apps/${modulePath} && git log --oneline HEAD..origin/main`,
      { exitOnError: false }
    )

    if (!output.trim()) {
      return []
    }

    // Parse the output to extract commit hash and message
    const commits = output
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        const [hash, ...messageParts] = line.split(' ')

        return {
          hash,
          message: messageParts.join(' ')
        }
      })

    return commits
  } catch (error) {
    CLILoggingService.warn(
      `Failed to check for updates in ${modulePath}: ${error}`
    )

    return []
  }
}

async function updateSingleModule(moduleName: string): Promise<void> {
  CLILoggingService.step(`Checking for updates in module: ${moduleName}`)

  const availableUpdates = await checkForUpdates(moduleName)

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
      `cd apps/${moduleName} && git pull origin main && bun install`
    )

    if (fs.existsSync(`apps/${moduleName}/server/schema.ts`)) {
      executeCommand(`bun forge db generate-migrations ${moduleName}`)
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
