import CLILoggingService from '@/utils/logging'
import { checkRunningPBInstances } from '@/utils/pocketbase'

import {
  checkGitCleanliness,
  checkGithubCLI,
  createGithubRepo,
  replaceRepoWithSubmodule
} from '../functions/git'
import { getInstalledModules } from '../utils/file-system'

export async function publishModuleHandler(moduleName: string): Promise<void> {
  const availableModules = getInstalledModules()

  if (!availableModules.includes(moduleName)) {
    CLILoggingService.actionableError(
      `Module ${moduleName} is not installed.`,
      `Available modules: ${availableModules.join(', ')}`
    )
    process.exit(1)
  }

  checkRunningPBInstances()
  checkGitCleanliness(moduleName)
  checkGithubCLI()

  const repoLink = createGithubRepo(moduleName)

  replaceRepoWithSubmodule(moduleName, repoLink)
}
