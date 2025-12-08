import fs from 'fs'

import { checkRunningPBInstances, executeCommand } from '../../../utils/helpers'
import { CLILoggingService } from '../../../utils/logging'
import { getInstalledModules } from '../utils/file-system'

function checkGitCleanliness(moduleName: string): void {
  const modulePath = `apps/${moduleName}`

  try {
    const superprojectDirResult = executeCommand(
      'git rev-parse --show-superproject-working-tree',
      {
        cwd: modulePath,
        stdio: 'pipe'
      }
    )

    if (superprojectDirResult.trim() !== '') {
      CLILoggingService.actionableError(
        `Module ${moduleName} is already published as a Git submodule.`,
        `To republish, please remove the submodule first using 'git submodule deinit -f ${modulePath}' and 'git rm -f ${modulePath}', then try publishing again.`
      )
      process.exit(1)
    }

    const gitStatusOutput = executeCommand('git status --porcelain', {
      cwd: modulePath,
      stdio: 'pipe'
    })

    if (gitStatusOutput.trim() !== '') {
      CLILoggingService.actionableError(
        `Module ${moduleName} has uncommitted changes.`,
        'Please commit or stash your changes before publishing the module.'
      )
      process.exit(1)
    }

    const remoteCheck = executeCommand('git remote', {
      cwd: modulePath,
      stdio: 'pipe'
    })

    if (remoteCheck.trim().includes('origin')) {
      CLILoggingService.actionableError(
        `Module ${moduleName} already has a remote named 'origin'.`,
        'Please remove the existing remote before publishing the module.'
      )
      process.exit(1)
    }

    CLILoggingService.info(
      `Git status for module ${moduleName} is clean and ready for publishing.`
    )
  } catch (error) {
    CLILoggingService.actionableError(
      `Failed to check git status for module ${moduleName}: ${error instanceof Error ? error.message : String(error)}`,
      'Ensure you have git installed and are in a git repository.'
    )
    process.exit(1)
  }
}

function checkGithubCLI(): void {
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

function createGithubRepo(moduleName: string): string {
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

function replaceRepo(moduleName: string, repoLink: string): void {
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

  replaceRepo(moduleName, repoLink)
}
