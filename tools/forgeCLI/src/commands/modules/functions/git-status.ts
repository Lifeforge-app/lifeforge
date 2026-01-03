import { executeCommand, executeCommandWithOutput } from '@/utils/helpers'
import CLILoggingService from '@/utils/logging'

export interface CommitInfo {
  hash: string
  message: string
}

export function checkGitCleanliness(moduleName: string): void {
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

export async function checkForUpdates(
  modulePath: string
): Promise<CommitInfo[]> {
  try {
    executeCommandWithOutput(`cd apps/${modulePath} && git fetch origin main`, {
      exitOnError: false
    })

    const output = executeCommandWithOutput(
      `cd apps/${modulePath} && git log --oneline HEAD..origin/main`,
      { exitOnError: false }
    )

    if (!output.trim()) {
      return []
    }

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
