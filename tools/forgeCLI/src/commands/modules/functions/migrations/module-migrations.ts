import { generateMigrationsHandler } from '@/commands/db/handlers/generateMigrationsHandler'
import { cleanupOldMigrations } from '@/commands/db/utils/pocketbase-utils'
import { executeCommand } from '@/utils/helpers'
import CLILoggingService from '@/utils/logging'

export function generateSchemaMigrations(moduleName: string): void {
  CLILoggingService.progress(`Generating schema migrations for ${moduleName}`)

  try {
    generateMigrationsHandler(moduleName)
    CLILoggingService.success('Schema migrations generated successfully')
  } catch {
    CLILoggingService.warn(
      'No database schema found - skipping migrations (this is normal for UI-only modules)'
    )
  }
}

export async function removeModuleMigrations(
  moduleName: string
): Promise<void> {
  CLILoggingService.progress(`Removing migrations for module: ${moduleName}`)

  try {
    await cleanupOldMigrations(moduleName)
    CLILoggingService.success(`Migrations for module "${moduleName}" removed`)
  } catch (error) {
    CLILoggingService.warn(
      `Failed to remove migrations for ${moduleName}: ${error}`
    )
  }
}

export function generateDatabaseSchemas(): void {
  CLILoggingService.step('Generating database schemas for the new module...')

  executeCommand('bun run forge db pull', {
    cwd: process.cwd(),
    stdio: 'ignore'
  })

  CLILoggingService.success('Database schemas generated successfully.')
}
