import fs from 'fs'
import path from 'path'

import executeCommand from '@/utils/commands'
import Logging from '@/utils/logging'

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

  Logging.info(`Initializing git repository...`)

  try {
    executeCommand('git init', { cwd: targetDir, stdio: 'pipe' })
    executeCommand(`git remote add origin ${repoUrl}`, {
      cwd: targetDir,
      stdio: 'pipe'
    })
    executeCommand('git fetch origin', { cwd: targetDir, stdio: 'pipe' })
    executeCommand('git checkout -b main', { cwd: targetDir, stdio: 'pipe' })
    executeCommand('git reset origin/main', { cwd: targetDir, stdio: 'pipe' })
    executeCommand('git add .', { cwd: targetDir, stdio: 'pipe' })
    executeCommand(
      'git commit --allow-empty -m "feat: update to latest version from forgistry"',
      { cwd: targetDir, stdio: 'pipe' }
    )

    Logging.debug(`Git repository initialized with remote: ${repoUrl}`)
  } catch (error) {
    Logging.debug(`Failed to initialize git repository: ${error}`)
  }
}
