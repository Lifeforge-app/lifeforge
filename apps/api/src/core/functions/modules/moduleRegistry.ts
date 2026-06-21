interface ModuleEntry {
  hashedKey: string
  fullName: string
}

const registeredModules: ModuleEntry[] = []

export function registerModule(hashedKey: string, fullName: string) {
  registeredModules.push({ hashedKey, fullName })
}

export function isModuleRegistered(hashedKey: string): boolean {
  return registeredModules.some(m => m.hashedKey === hashedKey)
}

export function isModuleNameRegistered(fullName: string): boolean {
  return registeredModules.some(m => m.fullName === fullName)
}

export function getRegisteredModules(): ModuleEntry[] {
  return [...registeredModules]
}
