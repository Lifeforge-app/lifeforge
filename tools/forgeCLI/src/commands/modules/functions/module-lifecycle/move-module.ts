import fs from 'fs'
import path from 'path'

import { executeCommand } from '@/utils/helpers'
import CLILoggingService from '@/utils/logging'

import type { ModuleInstallConfig } from '../../utils/constants'
import { removeGitModulesEntry, removeGitSubmodule } from '../git/git-submodule'

export function moveModuleToApps(config: ModuleInstallConfig): void {
  CLILoggingService.step('Installing module to workspace')

  executeCommand(
    `git mv ${config.tempDir}/${config.moduleName} ${config.moduleDir}`
  )
  CLILoggingService.success(
    `Module ${config.author}/${config.moduleName} installed successfully`
  )

  let gitmodulesContent = fs.readFileSync('.gitmodules', 'utf-8')

  const modulePath = `${config.tempDir}/${config.moduleName}`

  gitmodulesContent = gitmodulesContent.replace(
    `[submodule "${modulePath}"]`,
    `[submodule "apps/${config.moduleName}"]`
  )

  fs.writeFileSync('.gitmodules', gitmodulesContent.trim() + '\n')

  executeCommand('git add .gitmodules')
}

export function removeModuleDirectory(moduleName: string): void {
  const modulePath = `apps/${moduleName}`

  const moduleDir = path.join(process.cwd(), modulePath)

  if (!fs.existsSync(moduleDir)) {
    CLILoggingService.warn(`Module directory ${modulePath} does not exist`)

    return
  }

  CLILoggingService.progress(`Removing module directory: ${modulePath}`)

  const gitModulesPath = path.join(process.cwd(), '.gitmodules')

  const isSubmodule =
    fs.existsSync(gitModulesPath) &&
    fs
      .readFileSync(gitModulesPath, 'utf8')
      .includes(`[submodule "${modulePath}"]`)

  if (isSubmodule) {
    try {
      removeGitSubmodule(modulePath)
    } catch {
      removeRegularDirectory(moduleDir, modulePath)
      removeGitModulesEntry(modulePath)
    }
  } else {
    removeRegularDirectory(moduleDir, modulePath)
  }
}

export function removeRegularDirectory(
  moduleDir: string,
  modulePath: string
): void {
  try {
    fs.rmSync(moduleDir, { recursive: true, force: true })
    CLILoggingService.success(`Module directory removed: ${modulePath}`)
  } catch (error) {
    CLILoggingService.actionableError(
      `Failed to remove module directory: ${modulePath}`,
      'Check file permissions and ensure no processes are using the module files'
    )
    throw error
  }
}
