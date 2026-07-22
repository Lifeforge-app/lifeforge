import { createServiceLogger } from '@functions/logging'

import type {
  Module,
  ModuleEntry,
  ModuleManifest,
  ModuleWidget
} from '@lifeforge/configs'

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
      if (process.env.NODE_ENV === 'production' && !mod.hasDist) {
        continue
      }

      const isDevMode = process.env.NODE_ENV !== 'production' && mod.hasSource

      list.push({
        name: mod.name,
        moduleId: mod.moduleId,
        displayName: mod.displayName,
        icon: mod.icon,
        category: mod.category,
        remoteEntryUrl: mod.remoteEntryUrl,
        APIKeyAccess: mod.APIKeyAccess,
        hasProvider: mod.hasProvider,
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
}
