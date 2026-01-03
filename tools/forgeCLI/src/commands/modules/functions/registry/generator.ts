import fs from 'fs'
import path from 'path'

import CLILoggingService from '@/utils/logging'

import { generateClientRegistry } from './client-registry'
import {
  getLifeforgeModules,
  getModulePath,
  moduleHasSchema
} from './module-utils'
import { generateSchemaRegistry } from './schema-registry'
import { generateServerRegistry } from './server-registry'

interface ModulePackageJson {
  exports?: Record<string, string | { types?: string; default?: string }>
  [key: string]: unknown
}

function generateManifestDeclaration(): string {
  return `// AUTO-GENERATED - DO NOT EDIT
// This declaration file allows TypeScript to type-check module imports
// without resolving internal module aliases like @
import type { ModuleConfig } from 'shared'

declare const manifest: ModuleConfig
export default manifest
`
}

function updateModulePackageJson(modulePath: string): boolean {
  const packageJsonPath = path.join(modulePath, 'package.json')

  if (!fs.existsSync(packageJsonPath)) {
    return false
  }

  const packageJson: ModulePackageJson = JSON.parse(
    fs.readFileSync(packageJsonPath, 'utf-8')
  )

  if (!packageJson.exports) {
    return false
  }

  let updated = false

  if (packageJson.exports['./manifest']) {
    const currentExport = packageJson.exports['./manifest']

    if (typeof currentExport === 'string') {
      packageJson.exports['./manifest'] = {
        types: './manifest.d.ts',
        default: currentExport
      }
      updated = true
    } else if (typeof currentExport === 'object' && !currentExport.types) {
      currentExport.types = './manifest.d.ts'
      updated = true
    }
  }

  const schemaPath = path.join(modulePath, 'server', 'schema.ts')

  if (fs.existsSync(schemaPath) && !packageJson.exports['./server/schema']) {
    packageJson.exports['./server/schema'] = './server/schema.ts'
    updated = true
  }

  if (updated) {
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + '\n'
    )
  }

  return updated
}

export function generateModuleRegistries(): void {
  CLILoggingService.progress('Generating module registries...')

  const modules = getLifeforgeModules()

  if (modules.length === 0) {
    CLILoggingService.info('No @lifeforge/* modules found')
  } else {
    CLILoggingService.debug(`Found ${modules.length} module(s):`)
    modules.forEach(mod => CLILoggingService.debug(`  - ${mod}`))
  }

  const serverOutputPath = path.join(
    process.cwd(),
    'server/src/core/routes/generated-routes.ts'
  )

  const clientOutputPath = path.join(
    process.cwd(),
    'client/src/module-registry.ts'
  )

  const schemaOutputPath = path.join(process.cwd(), 'server/src/core/schema.ts')

  // Generate server registry
  const serverContent = generateServerRegistry(modules)

  fs.mkdirSync(path.dirname(serverOutputPath), { recursive: true })
  fs.writeFileSync(serverOutputPath, serverContent)
  CLILoggingService.debug(`Generated: ${serverOutputPath}`)

  // Generate client registry
  const clientContent = generateClientRegistry(modules)

  fs.mkdirSync(path.dirname(clientOutputPath), { recursive: true })
  fs.writeFileSync(clientOutputPath, clientContent)
  CLILoggingService.debug(`Generated: ${clientOutputPath}`)

  // Generate schema registry (only for modules with schema.ts)
  const modulesWithSchema = modules.filter(mod => moduleHasSchema(mod))

  const schemaContent = generateSchemaRegistry(modulesWithSchema)

  fs.mkdirSync(path.dirname(schemaOutputPath), { recursive: true })
  fs.writeFileSync(schemaOutputPath, schemaContent)
  CLILoggingService.debug(`Generated: ${schemaOutputPath}`)

  // Generate manifest.d.ts for each module and update package.json
  for (const mod of modules) {
    const modulePath = getModulePath(mod)

    if (modulePath) {
      const declarationPath = path.join(modulePath, 'manifest.d.ts')

      const declarationContent = generateManifestDeclaration()

      fs.writeFileSync(declarationPath, declarationContent)
      CLILoggingService.debug(`Generated: ${declarationPath}`)

      const updated = updateModulePackageJson(modulePath)

      if (updated) {
        CLILoggingService.debug(
          `Updated: ${path.join(modulePath, 'package.json')}`
        )
      }
    }
  }

  CLILoggingService.success('Module registries generated')
}
