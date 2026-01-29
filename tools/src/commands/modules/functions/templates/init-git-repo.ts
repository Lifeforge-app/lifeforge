import executeCommand from '@/utils/commands'

export function initializeGitRepository(modulePath: string): void {
  executeCommand('git init', { cwd: modulePath })
  executeCommand('git add .', { cwd: modulePath })
  executeCommand('git commit -m "feat: initial commit"', {
    cwd: modulePath
  })
}
