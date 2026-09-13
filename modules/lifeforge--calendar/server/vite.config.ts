import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineModuleServerConfig } from '@lifeforge/configs/vite'

const __dirname = dirname(fileURLToPath(import.meta.url))
export default defineModuleServerConfig(__dirname)
