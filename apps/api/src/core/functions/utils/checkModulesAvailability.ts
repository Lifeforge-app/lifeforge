import { isModuleNameRegistered } from '../modules/moduleRegistry'

export async function checkModulesAvailability(
  moduleId: string
): Promise<boolean> {
  const fullName = moduleId.startsWith('@')
    ? moduleId
    : `@lifeforge/${moduleId}`

  return isModuleNameRegistered(fullName)
}
