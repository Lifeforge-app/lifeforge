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
  private static registeredSchemaParts = new Map<string, ResolvedModuleSchema>()

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
      ModuleRegistry.registerPath(absolutePath, entry.id)
    }
  }

  static unregister(name: string): void {
    const entry = ModuleRegistry.registeredModules.find(m => m.name === name)

    ModuleRegistry.registeredModules = ModuleRegistry.registeredModules.filter(
      m => m.name !== name
    )

    if (entry) {
      for (const [modPath, modId] of ModuleRegistry.modulePaths.entries()) {
        if (modId === entry.id) {
          ModuleRegistry.modulePaths.delete(modPath)
        }
      }

      ModuleRegistry.unregisterSchemaPart(entry.id)
    }
  }

  static isRegistered(name: string): boolean {
    return ModuleRegistry.registeredModules.some(m => m.name === name)
  }

  /** Whether a module (by full name or short id) is currently registered. */
  static isAvailable(nameOrId: string): boolean {
    return ModuleRegistry.registeredModules.some(
      m => m.id === nameOrId || m.name === nameOrId
    )
  }

  static get entries(): ModuleEntry[] {
    return [...ModuleRegistry.registeredModules]
  }

  static get manifests(): ModuleManifest[] {
    return ModuleRegistry.registeredModules.map(mod => ({
      name: mod.name,
      id: mod.id,
      remoteId: mod.remoteId,
      displayName: mod.displayName,
      icon: mod.icon,
      category: mod.category,
      remoteEntryUrl: mod.remoteEntryUrl,
      APIKeyAccess: mod.APIKeyAccess,
      hasProvider: mod.hasProvider,
      hidden: mod.hidden,
      subsection: mod.subsection
    }))
  }

  static get list(): Module[] {
    const list: Module[] = []

    for (const mod of ModuleRegistry.registeredModules) {
      list.push({
        name: mod.name,
        id: mod.id,
        remoteId: mod.remoteId,
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

  /** Registers an absolute module directory against its module id. */
  static registerPath(moduleDir: string, id: string): void {
    ModuleRegistry.modulePaths.set(normalizePath(moduleDir), id)
  }

  static getPath(id: string): string | undefined {
    for (const [modPath, modId] of ModuleRegistry.modulePaths.entries()) {
      if (modId === id) {
        return modPath
      }
    }

    return undefined
  }

  /** Resolves the registered module entry that contains `filePath`. */
  static getModuleByPath(filePath: string): ModuleEntry | undefined {
    const id = ModuleRegistry.getModuleIdByPath(filePath)

    return id
      ? ModuleRegistry.registeredModules.find(m => m.id === id)
      : undefined
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
