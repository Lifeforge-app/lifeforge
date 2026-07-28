import type {
  Module,
  ModuleEntry,
  ModuleManifest,
  ModuleWidget
} from '@lifeforge/configs'

export class ModuleRegistry {
  private static registeredModules: ModuleEntry[] = []
  private static modulePaths = new Map<string, string>()

  static register(entry: ModuleEntry, absolutePath?: string): void {
    ModuleRegistry.registeredModules.push(entry)
    if (absolutePath) {
      ModuleRegistry.modulePaths.set(absolutePath, entry.name)
    }
  }

  static unregister(name: string): void {
    ModuleRegistry.registeredModules = ModuleRegistry.registeredModules.filter(m => m.name !== name)
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

  static getPath(moduleIdOrName: string): string | undefined {
    for (const [modPath, name] of ModuleRegistry.modulePaths.entries()) {
      if (name === moduleIdOrName || name.endsWith('/' + moduleIdOrName)) {
        return modPath
      }
    }
    return undefined
  }

  static getModuleByPath(filePath: string): { source: 'app'; id: string } | undefined {
    for (const [modPath, name] of ModuleRegistry.modulePaths.entries()) {
      if (filePath.startsWith(modPath)) {
        return { source: 'app', id: name }
      }
    }
    return undefined
  }
}
