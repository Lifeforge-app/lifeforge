import fs from 'fs'
import path from 'path'

import { findProjectRoot } from '@lifeforge/configs/node'

export const ROOT_DIR = findProjectRoot()

export const LOCALES_DIR = path.join(ROOT_DIR, 'locales')

if (!fs.existsSync(LOCALES_DIR)) {
  fs.mkdirSync(LOCALES_DIR)
}
