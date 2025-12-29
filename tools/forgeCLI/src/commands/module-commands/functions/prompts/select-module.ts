import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import prompts from 'prompts'

import CLILoggingService from '@/utils/logging'

import {
  getInstalledModules,
  hasServerComponents
} from '../../utils/file-system'

export async function selectModuleToRemove(): Promise<string> {
  const installedModules = getInstalledModules()

  if (installedModules.length === 0) {
    CLILoggingService.info('No modules found to remove')
    process.exit(0)
  }

  const choices = installedModules.map(module => {
    const modulePath = `apps/${module}`

    const packageJsonPath = path.join(modulePath, 'package.json')

    let description = 'No description'

    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

        description = packageData.description || 'No description'
      } catch {
        // If we can't read package.json, use defaults
      }
    }

    const { hasServerDir, hasServerIndex } = hasServerComponents(module)

    const serverStatus =
      hasServerDir && hasServerIndex
        ? chalk.green('[Server]')
        : chalk.blue('[Client only]')

    return {
      title: `${chalk.cyan.bold(module)} - ${chalk.gray(description)} ${serverStatus}`,
      value: module
    }
  })

  choices.push({
    title: chalk.red('Cancel (do not remove any module)'),
    value: '__cancel__'
  })

  const response = await prompts({
    type: 'autocomplete',
    name: 'selectedModule',
    message: 'Which module would you like to remove?',
    choices,
    initial: 0,
    suggest: (input: string, choices: { value?: string; title?: string }[]) => {
      return Promise.resolve(
        choices.filter(
          choice =>
            choice.value?.toLowerCase().includes(input.toLowerCase()) ||
            choice.title?.toLowerCase().includes(input.toLowerCase())
        )
      )
    }
  })

  if (!response.selectedModule || response.selectedModule === '__cancel__') {
    CLILoggingService.info('Module removal cancelled')
    process.exit(0)
  }

  const confirmResponse = await prompts({
    type: 'confirm',
    name: 'confirmRemoval',
    message: `Are you sure you want to PERMANENTLY REMOVE the "${response.selectedModule}" module?\n   This action cannot be undone and will delete all module files and migrations.`,
    initial: false
  })

  if (!confirmResponse.confirmRemoval) {
    CLILoggingService.info('Module removal cancelled')
    process.exit(0)
  }

  return response.selectedModule
}
