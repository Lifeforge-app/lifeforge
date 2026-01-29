import fs from 'fs'
import path from 'path'

import executeCommand from '@/utils/commands'
import logger from '@/utils/logger'

/**
 * Initializes a git repository in the target directory and sets up the remote.
 *
 * Reads the repository URL from package.json and initializes git with:
 * - Creates a new git repository
 * - Adds the remote origin
 * - Fetches from origin and checks out main branch
 * - Creates an initial commit
 *
 * @param targetDir - The directory to initialize the git repository in
 */
export default function initGitRepository(targetDir: string): void {
  const pkgPath = path.join(targetDir, 'package.json')

  if (!fs.existsSync(pkgPath)) {
    return
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))

  const repoUrl = pkg.repository?.url

  if (!repoUrl || pkg.repository?.type !== 'git') {
    return
  }

  logger.info(`Initializing git repository...`)

  try {
    executeCommand('git init', { cwd: targetDir, exitOnError: false })
    executeCommand(`git remote add origin ${repoUrl}`, {
      cwd: targetDir,
      exitOnError: false
    })
    executeCommand('git fetch origin', { cwd: targetDir, exitOnError: false })
    executeCommand('git checkout -b main', {
      cwd: targetDir,
      exitOnError: false
    })
    executeCommand('git reset origin/main', {
      cwd: targetDir,
      exitOnError: false
    })
    executeCommand('git add .', { cwd: targetDir, exitOnError: false })
    executeCommand(
      'git commit --allow-empty -m "feat: update to latest version from forgistry"',
      { cwd: targetDir, exitOnError: false }
    )

    logger.debug(`Git repository initialized with remote: ${repoUrl}`)
  } catch (error) {
    logger.error(`Failed to initialize git repository.`)
    logger.debug(`Error details: ${error}`)
  }
}
