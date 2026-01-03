import { executeCommand } from '@/utils/helpers'
import CLILoggingService from '@/utils/logging'

export function installDependencies(cwd?: string): void {
  CLILoggingService.progress('Installing dependencies')

  try {
    executeCommand('bun install --linker isolated', {
      cwd: cwd ?? process.cwd(),
      stdio: ['ignore', 'ignore', 'ignore'],
      exitOnError: false
    })
    CLILoggingService.success('Dependencies installed successfully')
  } catch (error) {
    CLILoggingService.actionableError(
      'Failed to install dependencies',
      'Ensure Bun is installed and you have internet connectivity'
    )
    throw error
  }
}
