import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'

const listProviders = forgeController
  .query()
  .noAuth()
  .noEncryption()
  .description({
    en: 'Retrieve available OAuth providers',
    ms: 'Dapatkan penyedia OAuth yang tersedia',
    'zh-CN': '获取可用的OAuth提供商',
    'zh-TW': '獲取可用的OAuth提供商'
  })
  .input({})
  .callback(async () => {
    // OAuth providers will be configured via Passport.js in a future update
    // For now, return empty array as OAuth is disabled during migration
    return []
  })

const getEndpoint = forgeController
  .query()
  .noAuth()
  .noEncryption()
  .description({
    en: 'Get OAuth authorization URL for provider',
    ms: 'Dapatkan URL kebenaran OAuth untuk penyedia',
    'zh-CN': '获取提供商的OAuth授权URL',
    'zh-TW': '獲取提供商的OAuth授權URL'
  })
  .input({})
  .callback(async () => {
    throw new ClientError(
      'OAuth is temporarily disabled during authentication migration',
      503
    )
  })

const verify = forgeController
  .mutation()
  .noAuth()
  .description({
    en: 'Verify OAuth authorization callback',
    ms: 'Sahkan panggilan balik kebenaran OAuth',
    'zh-CN': '验证OAuth授权回调',
    'zh-TW': '驗證OAuth授權回調'
  })
  .input({})
  .callback(async () => {
    throw new ClientError(
      'OAuth is temporarily disabled during authentication migration',
      503
    )
  })

export default forgeRouter({
  listProviders,
  getEndpoint,
  verify
})
