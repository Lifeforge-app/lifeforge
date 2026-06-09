import fs from 'fs'

export async function checkModulesAvailability(
  moduleId: string
): Promise<boolean> {
  const modulePath = `../modules/${moduleId}/`

  try {
    fs.accessSync(modulePath, fs.constants.R_OK)

    return true
  } catch {
    return false
  }
}
