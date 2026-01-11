import z from 'zod'

import { forgeController } from '@functions/routes'

import { devModeFile } from '../'

export const toggle = forgeController
  .mutation()
  .description({
    en: 'Toggle dev mode for a module',
    ms: 'Tukar mod pembangunan untuk modul',
    'zh-CN': '切换模块的开发模式',
    'zh-TW': '切換模組的開發模式'
  })
  .input({
    body: z.object({
      moduleName: z.string().min(1)
    })
  })
  .callback(async ({ body: { moduleName } }) => {
    const modules = (devModeFile.read() as string[]) || []

    const index = modules.indexOf(moduleName)

    if (index === -1) {
      modules.push(moduleName)
    } else {
      modules.splice(index, 1)
    }

    devModeFile.write(JSON.stringify(modules))

    return { success: true, isDevMode: index === -1 }
  })
