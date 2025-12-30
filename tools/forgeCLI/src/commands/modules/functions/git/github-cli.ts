import fs from 'fs'

import { executeCommand } from '@/utils/helpers'
import CLILoggingService from '@/utils/logging'

export function checkGithubCLI(): void {
  try {
    executeCommand('gh --version', { stdio: 'pipe' })
  } catch {
    CLILoggingService.actionableError(
      'GitHub CLI is not installed or not found in PATH.',
      'Please install GitHub CLI from https://cli.github.com/ and ensure it is accessible from your command line.'
    )
    process.exit(1)
  }

  CLILoggingService.info('GitHub CLI is installed and ready to use.')

  const authCheck = executeCommand('gh auth status', { stdio: 'pipe' })

  if (!authCheck.includes('Logged in to github.com')) {
    CLILoggingService.actionableError(
      'GitHub CLI is not authenticated.',
      'Please authenticate by running "gh auth login" and follow the prompts.'
    )
    process.exit(1)
  }

  CLILoggingService.info('GitHub CLI is authenticated.')
}

export function createGithubRepo(moduleName: string): string {
  try {
    executeCommand(
      `gh repo create lifeforge-module-${moduleName} --public --source=./apps/${moduleName} --remote=origin --push`,
      { stdio: 'pipe' }
    )

    const repoLinkResult = executeCommand(`git remote get-url origin`, {
      stdio: 'pipe',
      cwd: `apps/${moduleName}`
    })

    const repoLinkMatch = repoLinkResult.match(
      /https:\/\/github\.com\/(.*?\/lifeforge-module-.*?)\.git/
    )

    if (!repoLinkMatch) {
      CLILoggingService.actionableError(
        `Failed to parse GitHub repository link for module ${moduleName}.`,
        'Please check the output above for any errors.'
      )
      process.exit(1)
    }

    const repoLink = repoLinkMatch[1]

    CLILoggingService.success(
      `GitHub repository for module ${moduleName} created and code pushed successfully.`
    )

    return repoLink
  } catch {
    CLILoggingService.actionableError(
      `Failed to create GitHub repository for module ${moduleName}.`,
      'Refer to the error message above for more details.'
    )
    process.exit(1)
  }
}

export function replaceRepoWithSubmodule(
  moduleName: string,
  repoLink: string
): void {
  const modulePath = `apps/${moduleName}`

  try {
    fs.rmSync(modulePath, { recursive: true, force: true })
    executeCommand(`bun forge modules add ${repoLink}`)
  } catch (error) {
    CLILoggingService.actionableError(
      `Failed to replace local module ${moduleName} with Git submodule.`,
      `Error: ${error instanceof Error ? error.message : String(error)}`
    )
    process.exit(1)
  }
}
