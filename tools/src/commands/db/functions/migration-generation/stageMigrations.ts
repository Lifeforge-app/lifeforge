import chalk from 'chalk'
import PocketBase from 'pocketbase'
import type { CollectionModel } from 'pocketbase'

import logger from '@/utils/logger'

import generateSkeletonContent from './generateContent/skeleton'
import generateStructureContent from './generateContent/structure'
import generateViewsContent from './generateContent/views'

const generateContentMap = {
  skeleton: generateSkeletonContent,
  structure: generateStructureContent,
  views: generateViewsContent
}

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
 *
 * @throws Error if any module's migration fails to generate
 */
export default async function stageMigration(
  pb: PocketBase,
  phase: 'skeleton' | 'structure' | 'views',
  index: number,
  importedSchemas: Array<{
    moduleName: string
    schema: Record<string, { raw: CollectionModel }>
  }>
) {
  logger.debug(`Phase ${index + 1}: Creating ${phase} migrations...`)

  const phaseFn = generateContentMap[phase]

  for (const { moduleName, schema } of importedSchemas) {
    try {
      await phaseFn(pb, schema)

      logger.debug(`Created ${phase} migration for ${chalk.blue(moduleName)}`)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)

      throw new Error(
        `Failed to create ${phase} migration for ${chalk.blue(moduleName)}: ${errorMessage}`
      )
    }
  }
}
