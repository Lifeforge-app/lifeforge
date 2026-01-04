import executeCommand from '@/utils/commands'

export function initializeGitRepository(modulePath: string): void {
  executeCommand('git init', { cwd: modulePath, stdio: 'ignore' })
  executeCommand('git add .', { cwd: modulePath, stdio: 'ignore' })
  executeCommand('git commit -m "feat: initial commit"', {
    cwd: modulePath,
    stdio: 'ignore'
  })
}
