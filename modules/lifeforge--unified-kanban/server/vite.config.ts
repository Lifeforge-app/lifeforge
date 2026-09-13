import type { UserConfig } from 'vite'

import { defineModuleServerConfig } from '@lifeforge/configs/vite'

const config: UserConfig = {
  ...defineModuleServerConfig(__dirname),
  ssr: {
    noExternal: [
      '@nestjs/common',
      '@nestjs/core',
      '@nestjs/platform-express',
      'reflect-metadata'
    ]
  }
}

export default config
