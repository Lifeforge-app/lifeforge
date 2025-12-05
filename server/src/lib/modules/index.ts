import z from 'zod'

import { forgeController, forgeRouter } from '@functions/routes'
import { checkModulesAvailability as cma } from '@functions/utils/checkModulesAvailability'

const checkModuleAvailability = forgeController
  .query()
  .description({
    en: 'Check if a module is available',
    ms: 'Periksa jika modul tersedia',
    'zh-CN': '检查模块是否可用',
    'zh-TW': '檢查模組是否可用'
  })
  .input({
    query: z.object({
      moduleId: z.string().min(1)
    })
  })
  .callback(async ({ query: { moduleId } }) => cma(moduleId))

export default forgeRouter({
  checkModuleAvailability
})
