import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

import { executeCommand } from '@/utils/helpers'
import CLILoggingService from '@/utils/logging'

export function updateGitSubmodules(): void {
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

export function removeGitSubmodule(modulePath: string): void {
  CLILoggingService.progress(`Removing git submodule: ${modulePath}`)

  try {
    execSync(`git submodule deinit -f ${modulePath}`, {
      cwd: process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe']
    })
    CLILoggingService.debug('Submodule deinitialized')

    execSync(`git rm -f ${modulePath}`, {
      cwd: process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe']
    })
    CLILoggingService.debug('Submodule removed from git')

    const gitModulesDir = path.join(
      process.cwd(),
      '.git',
      'modules',
      modulePath
    )

    if (fs.existsSync(gitModulesDir)) {
      fs.rmSync(gitModulesDir, { recursive: true, force: true })
      CLILoggingService.debug('Submodule git directory removed')
    }

    CLILoggingService.success(`Git submodule removed: ${modulePath}`)
  } catch (error) {
    CLILoggingService.warn(
      `Git submodule removal failed, falling back to manual removal: ${error}`
    )
    throw error
  }
}

export function removeGitModulesEntry(modulePath: string): void {
  const gitModulesPath = path.join(process.cwd(), '.gitmodules')

  if (!fs.existsSync(gitModulesPath)) {
    return
  }

  CLILoggingService.progress('Updating .gitmodules file')

  try {
    let gitModulesContent = fs.readFileSync(gitModulesPath, 'utf8')

    const moduleEntryRegex = new RegExp(
      `\\[submodule "${modulePath.replace(
        /[-/\\^$*+?.()|[\]{}]/g,
        '\\$&'
      )}"\\][^\\[]*`,
      'g'
    )

    gitModulesContent = gitModulesContent.replace(moduleEntryRegex, '')
    gitModulesContent = gitModulesContent.replace(/\n{3,}/g, '\n\n').trim()

    if (gitModulesContent) {
      fs.writeFileSync(gitModulesPath, gitModulesContent + '\n', 'utf8')
    } else {
      fs.unlinkSync(gitModulesPath)
    }

    CLILoggingService.success('.gitmodules file updated')
  } catch (error) {
    CLILoggingService.warn(`Failed to update .gitmodules file: ${error}`)
  }
}
