import { executeCommand } from '@/utils/helpers'
import Logging from '@/utils/logging'

export function initializeGitRepository(modulePath: string): void {
  Logging.step('Initializing git repository for the new module...')

  executeCommand('git init', { cwd: modulePath, stdio: 'ignore' })
  executeCommand('git add .', { cwd: modulePath, stdio: 'ignore' })
  executeCommand('git commit -m "feat: initial commit"', {
    cwd: modulePath,
    stdio: 'ignore'
  })
}
