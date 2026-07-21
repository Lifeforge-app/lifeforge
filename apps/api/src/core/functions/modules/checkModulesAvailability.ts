import { ModuleRegistry } from './moduleRegistry'

export async function checkModulesAvailability(
  moduleId: string
): Promise<boolean> {
  const name = moduleId.startsWith('@') ? moduleId : `@lifeforge/${moduleId}`

  return ModuleRegistry.isRegistered(name)
}
