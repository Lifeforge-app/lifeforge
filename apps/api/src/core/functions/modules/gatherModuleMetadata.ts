import { execSync } from 'child_process'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

import {
  type ModuleEntry,
  type ModuleWidget,
  modulePackageJSONSchema
} from '@lifeforge/configs'

import checkManifestProvider from './checkManifestProvider'
import { moduleLoaderLogger } from './moduleLoaderLogger'
import parseManifestSubsections from './parseManifestSubsections'
import parseManifestWidgets from './parseManifestWidgets'

/**
 * Reads a module's package.json and file structure to gather its metadata
 * (module id, supported languages, widgets, provider info, etc.).
 *
 * @param appsDir - Root directory containing all modules.
 * @param modDir - Name of the module directory.
 * @returns Module entry with server route flag, or `null` if the module is invalid.
 */
export default function gatherModuleMetadata(
  appsDir: string,
  modDir: string
): (ModuleEntry & { hasServerRoutes: boolean }) | null {
  const pkgPath = path.join(appsDir, modDir, 'package.json')

  if (!fs.existsSync(pkgPath)) {
    return null
  }

  try {
    const {
      data: packageJSON,
      success,
      error
    } = modulePackageJSONSchema.safeParse(
      JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
    )

    if (!success || !packageJSON) {
      moduleLoaderLogger.error(
        `Failed to process module ${modDir}: invalid package.json - ${error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ')}`
      )

      return null
    }

    const moduleId = crypto
      .createHash('sha256')
      .update(packageJSON.name)
      .digest('hex')

    const localesPath = path.join(appsDir, modDir, 'locales')
    const supportedLangs =
      fs.existsSync(localesPath) && fs.statSync(localesPath).isDirectory()
        ? fs
            .readdirSync(localesPath)
            .filter(file => /^[a-z]{2,3}(-[A-Z]{2,3})?\.json$/.test(file))
            .map(file => file.substring(0, file.length - 5))
        : []

    const hasServerRoutes = fs.existsSync(path.join(appsDir, modDir, 'server'))

    const clientDistPath = path.join(
      appsDir,
      modDir,
      'client',
      'dist',
      'remoteEntry.js'
    )

    let isDistValid = false

    if (fs.existsSync(clientDistPath) && fs.statSync(clientDistPath).size > 0) {
      try {
        execSync(`node --check "${clientDistPath}"`, { stdio: 'ignore' })
        isDistValid = true
      } catch {
        // syntax/check error
      }
    }

    const manifestPath = path.join(appsDir, modDir, 'client', 'manifest.ts')

    // Discover widgets JIT at server load
    const widgets: ModuleWidget[] = []
    const parsedWidgets = parseManifestWidgets(manifestPath)

    for (const pw of parsedWidgets) {
      widgets.push({
        id: pw.config.id,
        icon: pw.config.icon,
        minW: pw.config.minW,
        minH: pw.config.minH,
        maxW: pw.config.maxW,
        maxH: pw.config.maxH,
        moduleName: packageJSON.name,
        componentName: path.basename(pw.filePath, path.extname(pw.filePath))
      })
    }

    const hasProvider = checkManifestProvider(manifestPath)
    const subsection = parseManifestSubsections(manifestPath)

    return {
      moduleId,
      name: packageJSON.name,
      displayName: packageJSON.displayName,
      version: packageJSON.version,
      description: packageJSON.description,
      author: packageJSON.author,
      icon: packageJSON.lifeforge.icon,
      category: packageJSON.lifeforge.category,
      supportedLangs,
      remoteEntryUrl: `/modules/${modDir}/remoteEntry.js`,
      APIKeyAccess: packageJSON.lifeforge.APIKeyAccess,
      subsection,
      hasDist: isDistValid,
      hasProvider,
      widgets,
      hasServerRoutes
    }
  } catch (error) {
    moduleLoaderLogger.error(`Failed to process module ${modDir}: ${error}`)

    return null
  }
}
