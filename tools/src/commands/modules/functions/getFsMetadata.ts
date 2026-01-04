import fs from 'fs'
import path from 'path'

export default function getFsMetadata(moduleName: string) {
  const fullName = moduleName.startsWith('@lifeforge/')
    ? moduleName
    : `@lifeforge/${moduleName}`

  const shortName = fullName.replace('@lifeforge/', '')

  const appsDir = path.join(process.cwd(), 'apps')

  if (!fs.existsSync(appsDir)) {
    fs.mkdirSync(appsDir, { recursive: true })
  }

  const targetDir = path.join(appsDir, shortName)

  return {
    fullName,
    shortName,
    targetDir
  }
}
