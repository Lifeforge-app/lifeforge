import { createServiceLogger } from '@functions/logging'

import { Module, ModuleEntry, ModuleManifest, ModuleWidget } from './schemas'

export const moduleLoaderLogger = createServiceLogger('Module Loader')

export class ModuleRegistry {
  private static registeredModules: ModuleEntry[] = []

  static register(entry: ModuleEntry): void {
    ModuleRegistry.registeredModules.push(entry)
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
      const isDevMode = process.env.NODE_ENV !== 'production' && mod.hasSource

      list.push({
        name: mod.name,
        moduleId: mod.moduleId,
        displayName: mod.displayName,
        version: mod.version,
        description: mod.description,
        author: mod.author,
        icon: mod.icon,
        category: mod.category,
        remoteEntryUrl: mod.remoteEntryUrl,
        isInternal: mod.isInternal,
        APIKeyAccess: mod.APIKeyAccess,
        hasProvider: mod.hasProvider,
        isDevMode
      })
    }

    return list
  }

  static get list(): Module[] {
    const list: Module[] = []

    for (const mod of ModuleRegistry.registeredModules) {
      const isDevMode = process.env.NODE_ENV !== 'production' && mod.hasSource

      list.push({
        name: mod.name,
        moduleId: mod.moduleId,
        displayName: mod.displayName,
        version: mod.version,
        description: mod.description,
        author: mod.author,
        icon: mod.icon,
        category: mod.category,
        isInternal: mod.isInternal,
        hasDist: mod.hasDist,
        hasSource: mod.hasSource,
        hasProvider: mod.hasProvider,
        isDevMode
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
}
