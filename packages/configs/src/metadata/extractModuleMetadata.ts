import fs from 'fs'
import path from 'path'

import { type ModuleBundledMetadata } from '../interfaces/bundledMetadata.types'
import { modulePackageJSONSchema } from '../interfaces/module.types'

import parseManifest from './parseManifest'

/**
 * Extracts the complete serializable metadata of a module from its source:
 * the client manifest (`manifest.ts`), its `package.json`, and the presence
 * of a server directory.
 *
 * This is the single extractor used both at build time (to emit
 * `forge-manifest.json`) and in development (invoked live by the server).
 *
 * @param moduleDir - Absolute path to the module directory.
 * @returns The bundled module metadata.
 */
export default function extractModuleMetadata(
  moduleDir: string
): ModuleBundledMetadata {
  const manifestPath = path.join(moduleDir, 'client', 'manifest.ts')

  const packageJSON = modulePackageJSONSchema.parse(
    JSON.parse(fs.readFileSync(path.join(moduleDir, 'package.json'), 'utf-8'))
  )

  const { hasProvider, hidden, subsection, widgets } =
    parseManifest(manifestPath)

  return {
    hasProvider,
    hidden,
    subsection,
    widgets: widgets.map(widget => ({
      ...widget.config,
      componentName: path.basename(
        widget.filePath,
        path.extname(widget.filePath)
      )
    })),
    package: packageJSON,
    hasServer: fs.existsSync(path.join(moduleDir, 'server'))
  }
}
