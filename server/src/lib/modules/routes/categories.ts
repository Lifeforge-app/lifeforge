import z from 'zod'

import { forgeController } from '@functions/routes'

export const list = forgeController
  .query()
  .description({
    en: 'Get the category display order',
    ms: 'Dapatkan urutan paparan kategori',
    'zh-CN': '获取类别显示顺序',
    'zh-TW': '獲取類別顯示順序'
  })
  .input({})
  .callback(async ({ core: { tempFile } }) =>
    new tempFile('module_categories.json').read<
      Record<string, Record<string, string>>
    >()
  )

export const update = forgeController
  .mutation()
  .description({
    en: 'Update the category display order',
    ms: 'Kemas kini urutan paparan kategori',
    'zh-CN': '更新类别显示顺序',
    'zh-TW': '更新類別顯示順序'
  })
  .input({
    body: z.object({
      data: z.record(z.string(), z.record(z.string(), z.string()))
    })
  })
  .callback(async ({ body: { data }, core: { tempFile } }) => {
    new tempFile('module_categories.json').write(JSON.stringify(data))

    return { success: true }
  })

export const aiTranslate = forgeController
  .mutation()
  .description({
    en: 'Translate a specific category into desired languages',
    ms: 'Terjemahkan kategori tertentu ke bahasa yang diinginkan',
    'zh-CN': '将特定类别翻译成所需语言',
    'zh-TW': '將特定類別翻譯成所需語言'
  })
  .input({
    body: z.object({
      key: z.string(),
      languages: z.array(z.string())
    })
  })
  .callback(
    async ({
      body: { key, languages },
      pb,
      core: {
        api: { fetchAI }
      }
    }) =>
      fetchAI({
        pb,
        provider: 'openai',
        model: 'gpt-5-nano',
        messages: [
          {
            role: 'system',
            content: `You are a translation assistant for a software application's category names. Translate the given category key into natural, concise labels suitable for UI navigation. Keep translations short (1-3 words), capitalize appropriately for each language, and maintain consistent tone across all languages.`
          },
          {
            role: 'user',
            content: `Translate the category "${key}" into these languages: ${languages.join(', ')}. Return only the translations as requested.`
          }
        ],
        structure: z.object(
          languages.reduce(
            (acc, lang) => {
              acc[lang] = z.string()

              return acc
            },
            {} as Record<string, z.ZodString>
          )
        )
      })
  )
