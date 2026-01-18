import z from 'zod'

import forge from '../forge'

export const list = forge
  .query()
  .description('Get the category display order')
  .input({})
  .callback(async ({ core: { tempFile } }) =>
    new tempFile('module_categories.json').read<
      Record<string, Record<string, string>>
    >()
  )

export const update = forge
  .mutation()
  .description('Update the category display order')
  .input({
    body: z.object({
      data: z.record(z.string(), z.record(z.string(), z.string()))
    })
  })
  .callback(async ({ body: { data }, core: { tempFile } }) => {
    new tempFile('module_categories.json').write(JSON.stringify(data))

    return { success: true }
  })

export const aiTranslate = forge
  .mutation()
  .description('Translate a specific category into desired languages')
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
