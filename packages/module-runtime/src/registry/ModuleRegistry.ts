import type {
  Module,
  ModuleEntry,
  ModuleManifest,
  ModuleWidget
} from '@lifeforge/configs'

import type { ResolvedModuleSchema } from './types'

const normalizePath = (value: string): string => value.replace(/\\/g, '/')

/** Resolves the longest registered module directory containing `filePath`. */
function findModulePath(
  entries: Iterable<[string, string]>,
  filePath: string
): string | undefined {
  for (const [moduleDir] of entries) {
    if (filePath === moduleDir || filePath.startsWith(`${moduleDir}/`)) {
      return moduleDir
    }
  }

  return undefined
}

export class ModuleRegistry {
  private static registeredModules: ModuleEntry[] = []
  private static modulePaths = new Map<string, string>()
  private static registeredSchemaParts = new Map<
    string,
    ResolvedModuleSchema
  >()

  static register(entry: ModuleEntry, absolutePath?: string): void {
    const existingIndex = ModuleRegistry.registeredModules.findIndex(
      m => m.name === entry.name
    )

    if (existingIndex === -1) {
      ModuleRegistry.registeredModules.push(entry)
    } else {
      ModuleRegistry.registeredModules[existingIndex] = entry
    }

    if (absolutePath) {
      ModuleRegistry.registerPath(absolutePath, entry.name)
    }
  }

  static unregister(name: string): void {
    const entry = ModuleRegistry.registeredModules.find(m => m.name === name)

    ModuleRegistry.registeredModules = ModuleRegistry.registeredModules.filter(
      m => m.name !== name
    )

    for (const [modPath, modName] of ModuleRegistry.modulePaths.entries()) {
      if (modName === name) {
        ModuleRegistry.modulePaths.delete(modPath)
      }
    }

    if (entry) {
      // Schema parts are keyed by the scope-stripped module id (the same id
      // `getCallerModuleId` yields and `registerSchemaPart` receives).
      ModuleRegistry.unregisterSchemaPart(
        entry.name.replace(/^@lifeforge\//, '')
      )
    }
  }

  static isRegistered(name: string): boolean {
    return ModuleRegistry.registeredModules.some(m => m.name === name)
  }

  /** Whether a module (by full name or short id) is currently registered. */
  static isAvailable(nameOrId: string): boolean {
    const name = nameOrId.startsWith('@') ? nameOrId : `@lifeforge/${nameOrId}`

    return ModuleRegistry.isRegistered(name)
  }

  static get entries(): ModuleEntry[] {
    return [...ModuleRegistry.registeredModules]
  }

  static get manifests(): ModuleManifest[] {
    const list: ModuleManifest[] = []

    for (const mod of ModuleRegistry.registeredModules) {
      if (process.env.NODE_ENV === 'production' && !mod.hasDist) {
        continue
      }

      const isDevMode = process.env.NODE_ENV !== 'production' && !mod.hasDist

      list.push({
        name: mod.name,
        moduleId: mod.moduleId,
        displayName: mod.displayName,
        icon: mod.icon,
        category: mod.category,
        remoteEntryUrl: mod.remoteEntryUrl,
        APIKeyAccess: mod.APIKeyAccess,
        hasProvider: mod.hasProvider,
        hidden: mod.hidden,
        subsection: mod.subsection,
        isDevMode
      })
    }

    return list
  }

  static get list(): Module[] {
    const list: Module[] = []

    for (const mod of ModuleRegistry.registeredModules) {
      list.push({
        name: mod.name,
        moduleId: mod.moduleId,
        displayName: mod.displayName,
        version: mod.version,
        description: mod.description,
        author: mod.author,
        icon: mod.icon,
        category: mod.category
      })
    }

    return list
  }

  static get widgets(): ModuleWidget[] {
    const list: ModuleWidget[] = []

    for (const mod of ModuleRegistry.registeredModules) {
      list.push(...mod.widgets)
    }

    return list
  }

  /** Registers an absolute module directory against its official module id. */
  static registerPath(moduleDir: string, moduleId: string): void {
    ModuleRegistry.modulePaths.set(normalizePath(moduleDir), moduleId)
  }

  static getPath(moduleIdOrName: string): string | undefined {
    for (const [modPath, name] of ModuleRegistry.modulePaths.entries()) {
      if (name === moduleIdOrName || name.endsWith('/' + moduleIdOrName)) {
        return modPath
      }
    }

    return undefined
  }

  static getModuleByPath(
    filePath: string
  ): { source: 'app'; id: string } | undefined {
    const id = ModuleRegistry.getModuleIdByPath(filePath)

    return id ? { source: 'app', id } : undefined
  }

  /**
   * Resolves the official module id for a file inside a registered module. Only
   * matches at a directory boundary so `/modules/foo` never matches a file in
   * `/modules/foo-bar`.
   */
  static getModuleIdByPath(filePath: string): string | undefined {
    const normalizedPath = normalizePath(filePath)

    const matches = [...ModuleRegistry.modulePaths.entries()].sort(
      ([a], [b]) => b.length - a.length
    )

    const moduleDir = findModulePath(matches, normalizedPath)

    return moduleDir ? ModuleRegistry.modulePaths.get(moduleDir) : undefined
  }

  /** Registers a module's drizzle schema part (keyed by module id / 'core'). */
  static registerSchemaPart(id: string, part: ResolvedModuleSchema): void {
    ModuleRegistry.registeredSchemaParts.set(id, part)
  }

  /** Removes a module's drizzle schema part (no-op for 'core' or unknown ids). */
  static unregisterSchemaPart(id: string): void {
    ModuleRegistry.registeredSchemaParts.delete(id)
  }

  /** Bare table key -> namespaced key for a module, if it registered one. */
  static getModuleKeyMap(id: string): Record<string, string> | undefined {
    return ModuleRegistry.registeredSchemaParts.get(id)?.keyMap
  }

  static get schemaParts(): readonly ResolvedModuleSchema[] {
    return [...ModuleRegistry.registeredSchemaParts.values()]
  }
}
