import { log } from '@clack/prompts'

import { failSpinner, startSpinner, stopSpinner } from '@/utils/spinner'

import { pushSchemaFiles } from '../functions/pushSchema'
import { collectAllSchemaFiles } from '../functions/schema'

export async function pushSchemaHandler(): Promise<void> {
  startSpinner('Pushing schema to the database...')

  try {
    const { applied, failures } = await pushSchemaFiles(collectAllSchemaFiles())

    if (failures.length > 0) {
      failSpinner(`Failed to apply ${failures.length} statement(s):`)

      for (const failure of failures) {
        log.error(`  - ${failure}`)
      }

      process.exit(1)
    }

    stopSpinner(
      applied === 0
        ? 'Database is already in sync'
        : `Applied ${applied} statement${applied === 1 ? '' : 's'}`
    )
  } catch (error) {
    failSpinner(`Failed to push schema: ${(error as Error).message}`)

    process.exit(1)
  }
}
