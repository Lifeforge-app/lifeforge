import tailwindcss from '@tailwindcss/vite'

import { defineModuleClientConfig } from '@lifeforge/configs/vite'

export default defineModuleClientConfig(
  { dirname: __dirname },
  { plugins: [tailwindcss()] }
)
