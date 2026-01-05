import path from 'path'

import Logging from '@/utils/logging'

import applyMigrations from './applyMigrations'
import createSingleMigration from './createSingleMigration'

/**
 * Generates and applies migrations for a specific phase across all modules.
 *
 * The migration process is split into three phases that must run in order:
 * 1. **skeleton** - Creates stub collections if they don't exist (minimal structure)
 * 2. **structure** - Updates collections with full schema, fields, and relations
 * 3. **views** - Sets the actual viewQuery on view collections
 *
 * This phased approach ensures:
 * - Collections exist before relations reference them (skeleton phase)
 * - Relations can be resolved by name after all collections are created (structure phase)
 * - View queries can reference all tables after schemas are complete (views phase)
 *
 * @param phase - The migration phase: 'skeleton', 'structure', or 'views'
 * @param index - Zero-based index of the phase (used for logging)
 * @param importedSchemas - Array of module schemas to process
 * @param idToNameMap - Map of collection IDs to names for resolving relations
 *
 * @throws Error if any module's migration fails to generate
 */
export default async function stageMigration(
  phase: 'skeleton' | 'structure' | 'views',
  index: number,
  importedSchemas: Array<{
    moduleName: string
    schema: Record<string, { raw: Record<string, unknown> }>
  }>,
  idToNameMap: Map<string, string>
) {
  Logging.debug(`Phase ${index + 1}: Creating ${phase} migrations...`)

  const { default: phaseFn } = await import(
    path.resolve(import.meta.dirname, 'generateContent', `${phase}.ts`)
  )

  for (const { moduleName, schema } of importedSchemas) {
    try {
      await createSingleMigration(
        `${phase}_${moduleName}`,
        phaseFn(schema, idToNameMap)
      )

      Logging.debug(
        `Created ${phase} migration for ${Logging.highlight(moduleName)}`
      )
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)

      throw new Error(
        `Failed to create ${phase} migration for ${Logging.highlight(moduleName)}: ${errorMessage}`
      )
    }
  }

  applyMigrations()
}
