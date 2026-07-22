import type { ModuleConfig } from '@lifeforge/configs'

export const devModeImports = import.meta.env.DEV
  ? import.meta.glob<{ default: ModuleConfig }>(
      '../../../../../modules/*/client/manifest.ts',
      { eager: false }
    )
  : {}

export const devModePkgs = import.meta.env.DEV
  ? import.meta.glob<{ name: string }>(
      '../../../../../modules/*/package.json',
      { eager: true }
    )
  : {}
