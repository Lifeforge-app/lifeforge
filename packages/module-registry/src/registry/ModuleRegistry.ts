import type {
  Module,
  ModuleEntry,
  ModuleManifest,
  ModuleWidget
} from '@lifeforge/configs'

import type { ModuleSchemaDefinition } from '../types'

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
    ModuleSchemaDefinition
  >()

  static register(entry: ModuleEntry, absolutePath?: string): void {
    ModuleRegistry.registeredModules.push(entry)

    if (absolutePath) {
      ModuleRegistry.registerPath(absolutePath, entry.name)
    }
  }

  static unregister(name: string): void {
    ModuleRegistry.registeredModules = ModuleRegistry.registeredModules.filter(
      m => m.name !== name
    )

    for (const [modPath, modName] of ModuleRegistry.modulePaths.entries()) {
      if (modName === name) {
        ModuleRegistry.modulePaths.delete(modPath)
      }
    }
  }

  static isRegistered(name: string): boolean {
    return ModuleRegistry.registeredModules.some(m => m.name === name)
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
  static registerSchemaPart(id: string, part: ModuleSchemaDefinition): void {
    ModuleRegistry.registeredSchemaParts.set(id, part)
  }

  /** Bare table key -> namespaced key for a module, if it registered one. */
  static getModuleKeyMap(id: string): Record<string, string> | undefined {
    return ModuleRegistry.registeredSchemaParts.get(id)?.keyMap
  }

  static get schemaParts(): readonly ModuleSchemaDefinition[] {
    return [...ModuleRegistry.registeredSchemaParts.values()]
  }
}

/** Registers an absolute module directory against its official module id. */
export function registerModulePath(moduleDir: string, moduleId: string): void {
  ModuleRegistry.registerPath(moduleDir, moduleId)
}
