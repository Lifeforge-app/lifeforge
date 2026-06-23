interface ModuleEntry {
  hashedKey: string
  fullName: string
  supportedLangs: string[]
}

const registeredModules: ModuleEntry[] = []

export function registerModule(
  hashedKey: string,
  fullName: string,
  supportedLangs: string[]
) {
  registeredModules.push({ hashedKey, fullName, supportedLangs })
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
