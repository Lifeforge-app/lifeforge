/**
 * One-time migration script:
 * 1. Fetches all modules from the LifeForge registry (excluding language packs)
 * 2. Installs them in --dev mode
 * 3. Replaces --target bun with --target node in build:server script
 * 4. Publishes them back to the registry
 *
 * Usage: bun run tools/src/scripts/migrate-modules-to-node-target.ts
 */
import fs from 'fs'
import path from 'path'

import { installModuleHandler } from '@/commands/modules/handlers/installModuleHandler'
import { publishModuleHandler } from '@/commands/modules/handlers/publishModuleHandler'
import { ROOT_DIR } from '@/constants/constants'
import logger from '@/utils/logger'
import { getRegistryUrl } from '@/utils/registry'

const REGISTRY_SEARCH_URL = '/-/v1/search?text=@lifeforge&size=250'

interface RegistryPackage {
  package: {
    name: string
    description: string
  }
}

interface RegistrySearchResponse {
  objects: RegistryPackage[]
  total: number
}

async function fetchAllModules(): Promise<string[]> {
  const registryUrl = getRegistryUrl()

  const searchUrl = new URL(REGISTRY_SEARCH_URL, registryUrl)

  const response = await fetch(searchUrl.toString())

  if (!response.ok) {
    throw new Error(`Failed to fetch modules: ${response.statusText}`)
  }

  const data = (await response.json()) as RegistrySearchResponse

  // Filter out language packs (pattern: --lang-)
  return data.objects
    .map(obj => obj.package.name)
    .filter(name => !name.includes('--lang-'))
}

function getShortName(fullName: string): string {
  // @lifeforge/lifeforge--calendar -> lifeforge--calendar
  return fullName.replace('@lifeforge/', '')
}

function updateBuildServerTarget(modulePath: string): boolean {
  const packageJsonPath = path.join(modulePath, 'package.json')

  if (!fs.existsSync(packageJsonPath)) {
    logger.warn(`No package.json found at ${modulePath}`)

    return false
  }

  const content = fs.readFileSync(packageJsonPath, 'utf-8')

  const packageJson = JSON.parse(content)

  if (!packageJson.scripts?.['build:server']) {
    logger.debug(`No build:server script in ${modulePath}`)

    return false
  }

  const originalScript = packageJson.scripts['build:server']

  if (!originalScript.includes('--target bun')) {
    logger.debug(`build:server doesn't use --target bun in ${modulePath}`)

    return false
  }

  packageJson.scripts['build:server'] = originalScript.replace(
    '--target bun',
    '--target node'
  )

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')

  logger.success(`Updated build:server target in ${path.basename(modulePath)}`)

  return true
}

async function main(): Promise<void> {
  logger.info('Fetching all modules from registry...')

  const modules = await fetchAllModules()

  logger.info(`Found ${modules.length} modules (excluding language packs)`)

  for (const fullName of modules) {
    const shortName = getShortName(fullName)

    if (
      !(
        shortName.startsWith('lifeforge') ||
        shortName.startsWith('melvinchia3636')
      )
    ) {
      logger.debug(`Skipping ${shortName}`)

      continue
    }

    logger.print(`\n${'='.repeat(60)}`)
    logger.info(`Processing: ${shortName}`)
    logger.print('='.repeat(60))

    try {
      // Step 1: Install in dev mode
      logger.info('Step 1: Installing in --dev mode...')
      await installModuleHandler([shortName], { dev: true })

      // Step 2: Update build:server target
      const modulePath = path.join(ROOT_DIR, 'apps', shortName)

      logger.info('Step 2: Updating build:server target...')

      const updated = updateBuildServerTarget(modulePath)

      if (!updated) {
        logger.warn(`Skipping publish for ${shortName} (no changes made)`)
        continue
      }

      // Step 3: Publish
      logger.info('Step 3: Publishing...')
      await publishModuleHandler(shortName)

      logger.success(`Completed migration for ${shortName}`)
    } catch (error) {
      logger.error(`Failed to process ${shortName}: ${error}`)
      logger.warn(`Skipping ${shortName} and continuing...`)
    }
  }

  logger.print(`\n${'='.repeat(60)}`)
  logger.success('Migration complete!')
  logger.print('='.repeat(60))
}

main().catch(error => {
  logger.error(`Migration failed: ${error}`)
  process.exit(1)
})
