import fs from 'fs'
import path from 'path'

export const LOCALES_DIR = path.join(process.cwd(), 'locales')

if (!fs.existsSync(LOCALES_DIR)) {
  fs.mkdirSync(LOCALES_DIR)
}
