import fs from 'fs'
import path from 'path'

export const ROOT_DIR = import.meta.dirname.split('/tools')[0]

export const LOCALES_DIR = path.join(ROOT_DIR, 'locales')

if (!fs.existsSync(LOCALES_DIR)) {
  fs.mkdirSync(LOCALES_DIR)
}
