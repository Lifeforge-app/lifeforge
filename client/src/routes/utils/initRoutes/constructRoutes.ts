import {
  type ModuleCategory,
  type ModuleConfig,
  packageJSONSchema
} from 'shared'
import z from 'zod'

import constructModuleMap, { type ModuleFiles } from './constructModuleMap'
import sortRoutes from './routeSorter'

/**
 * Parses the content of a module's package.json and manifest.ts files
 * Uses zod to validate the package.json file
 *
 * @param entry The module's package.json and manifest.ts files
 * @returns The parsed package.json and manifest.ts files
 * @throws Error if the package.json or manifest.ts files are invalid
 */
async function parseContent(entry: [string, Partial<ModuleFiles>]) {
  const [packagePath, files] = entry

  if (!files.packageJsonResolver || !files.manifestResolver) {
    throw new Error(`Missing package.json or manifest.ts for ${packagePath}`)
  }

  const mod = await files.packageJsonResolver()

  const packageJSONContent = z.safeParse(packageJSONSchema, mod)

  if (!packageJSONContent.success) {
    throw new Error(
      `Error parsing package.json for ${packagePath}:\n${z.treeifyError(packageJSONContent.error)}`
    )
  }

  const manifestContent = (await files.manifestResolver()) as {
    default: ModuleConfig
  }

  if (!manifestContent.default) {
    throw new Error(`Invalid manifest for ${packagePath}`)
  }

  return {
    packageJSON: packageJSONContent,
    manifest: manifestContent
  }
}

/**
 * Constructs the final module configuration
 * It is a consolidation of the package.json and manifest.ts files
 *
 * @param packageJSON The parsed package.json file
 * @param manifest The parsed manifest.ts file
 * @returns The module configuration
 */
const constructModuleConfig = (
  packageJSON: z.infer<typeof packageJSONSchema>,
  manifest: ModuleConfig
) => {
  const category = packageJSON.lifeforge.category || 'Miscellaneous'

  const moduleConfig: ModuleCategory['items'][number] = {
    ...manifest,
    name: packageJSON.name.split('/').pop()!,
    displayName: packageJSON.displayName,
    version: packageJSON.version,
    description: packageJSON.description,
    author: packageJSON.author,
    icon: packageJSON.lifeforge.icon,
    category,
    APIKeyAccess: packageJSON.lifeforge.APIKeyAccess
  }

  return {
    category,
    moduleConfig
  }
}

/**
 * Adds the module configuration to the routes
 * If the category already exists, it will add the module configuration to the existing category
 * Otherwise, it will create a new category
 *
 * @param routes The routes to add the module configuration to
 * @param category The category of the module
 * @param moduleConfig The module configuration
 */
const addToRoute = (
  routes: ModuleCategory[],
  category: string,
  moduleConfig: ModuleCategory['items'][number]
) => {
  const categoryIndex = routes.findIndex(cat => cat.title === category)

  if (categoryIndex > -1) {
    routes[categoryIndex].items.push(moduleConfig)
  } else {
    routes.push({
      title: category,
      items: [moduleConfig]
    })
  }
}

/**
 * Entry point for constructing the routes
 *
 * @returns The final routes
 */
export default async function constructRoutes() {
  const moduleMap = constructModuleMap()

  const ROUTES: ModuleCategory[] = []

  for (const entry of moduleMap.entries()) {
    const { packageJSON, manifest } = await parseContent(entry)

    const { category, moduleConfig } = constructModuleConfig(
      packageJSON.data,
      manifest.default
    )

    addToRoute(ROUTES, category, moduleConfig)
  }

  return sortRoutes(ROUTES)
}
