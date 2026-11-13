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

interface RegistryState {
  registeredModules: ModuleEntry[]
  modulePaths: Map<string, string>
  registeredSchemaParts: Map<string, ResolvedModuleSchema>
}

/**
 * The registry state is kept on `globalThis` so that every instance of this
 * package shares a single store - even when the package is both bundled into
 * one consumer and resolved from node_modules by another (e.g. the API bundle
 * inlining it while the external `server-utils`/`drizzle` import it).
 */
const REGISTRY_STATE_KEY = Symbol.for('lifeforge.module-registry.state')

function state(): RegistryState {
  const globalObject = globalThis as unknown as Record<
    symbol,
    RegistryState | undefined
  >

  if (!globalObject[REGISTRY_STATE_KEY]) {
    globalObject[REGISTRY_STATE_KEY] = {
      registeredModules: [],
      modulePaths: new Map(),
      registeredSchemaParts: new Map()
    }
  }

  return globalObject[REGISTRY_STATE_KEY]
}

export class ModuleRegistry {
  static register(entry: ModuleEntry, absolutePath?: string): void {
    const { registeredModules } = state()

    const existingIndex = registeredModules.findIndex(
      m => m.name === entry.name
    )

    if (existingIndex === -1) {
      registeredModules.push(entry)
    } else {
      registeredModules[existingIndex] = entry
    }

    if (absolutePath) {
      ModuleRegistry.registerPath(absolutePath, entry.id)
    }
  }

  static unregister(name: string): void {
    const store = state()

    const entry = store.registeredModules.find(m => m.name === name)

    store.registeredModules = store.registeredModules.filter(
      m => m.name !== name
    )

    if (entry) {
      for (const [modPath, modId] of store.modulePaths.entries()) {
        if (modId === entry.id) {
          store.modulePaths.delete(modPath)
        }
      }

      ModuleRegistry.unregisterSchemaPart(entry.id)
    }
  }

  static isRegistered(name: string): boolean {
    return state().registeredModules.some(m => m.name === name)
  }

  /** Whether a module (by full name or short id) is currently registered. */
  static isAvailable(nameOrId: string): boolean {
    return state().registeredModules.some(
      m => m.id === nameOrId || m.name === nameOrId
    )
  }

  static get entries(): ModuleEntry[] {
    return [...state().registeredModules]
  }

  static get manifests(): ModuleManifest[] {
    return state().registeredModules.map(mod => ({
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

    for (const mod of state().registeredModules) {
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

    for (const mod of state().registeredModules) {
      list.push(...mod.widgets)
    }

    return list
  }

  /** Registers an absolute module directory against its module id. */
  static registerPath(moduleDir: string, id: string): void {
    state().modulePaths.set(normalizePath(moduleDir), id)
  }

  static getPath(id: string): string | undefined {
    for (const [modPath, modId] of state().modulePaths.entries()) {
      if (modId === id) {
        return modPath
      }
    }

    return undefined
  }

  /** Resolves the registered module entry that contains `filePath`. */
  static getModuleByPath(filePath: string): ModuleEntry | undefined {
    const id = ModuleRegistry.getModuleIdByPath(filePath)

    return id ? state().registeredModules.find(m => m.id === id) : undefined
  }

  /**
   * Resolves the official module id for a file inside a registered module. Only
   * matches at a directory boundary so `/modules/foo` never matches a file in
   * `/modules/foo-bar`.
   */
  static getModuleIdByPath(filePath: string): string | undefined {
    const store = state()

    const normalizedPath = normalizePath(filePath)

    const matches = [...store.modulePaths.entries()].sort(
      ([a], [b]) => b.length - a.length
    )

    const moduleDir = findModulePath(matches, normalizedPath)

    return moduleDir ? store.modulePaths.get(moduleDir) : undefined
  }

  /** Registers a module's drizzle schema part (keyed by module id / 'core'). */
  static registerSchemaPart(id: string, part: ResolvedModuleSchema): void {
    state().registeredSchemaParts.set(id, part)
  }

  /** Removes a module's drizzle schema part (no-op for 'core' or unknown ids). */
  static unregisterSchemaPart(id: string): void {
    state().registeredSchemaParts.delete(id)
  }

  /** Bare table key -> namespaced key for a module, if it registered one. */
  static getModuleKeyMap(id: string): Record<string, string> | undefined {
    return state().registeredSchemaParts.get(id)?.keyMap
  }

  static get schemaParts(): readonly ResolvedModuleSchema[] {
    return [...state().registeredSchemaParts.values()]
  }
}
