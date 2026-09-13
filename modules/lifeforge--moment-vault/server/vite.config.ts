import { defineModuleServerConfig } from "@lifeforge/configs/vite"
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
export default defineModuleServerConfig(__dirname)

