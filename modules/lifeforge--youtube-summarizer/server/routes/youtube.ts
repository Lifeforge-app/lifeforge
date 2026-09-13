import { exec } from 'child_process'
import z from 'zod'

import forge from '../forge'

export const getYoutubeVideoInfo = forge
  .query({
    description: 'Retrieve YouTube video metadata and captions',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    output: {
      OK: z.object({
        title: z.string(),
        uploadDate: z.string(),
        uploader: z.string(),
        duration: z.string(),
        viewCount: z.number(),
        likeCount: z.number(),
        thumbnail: z.string(),
        captions: z.record(z.string(), z.array(z.object({
          ext: z.string(),
          url: z.string(),
          name: z.string().nullable()
        }))),
        auto_captions: z.record(z.string(), z.array(z.object({
          ext: z.string(),
          url: z.string(),
          name: z.string().nullable()
        })))
      })
    }
  })
  .callback(async ({ query: { id }, response }) => {
    try {
      const result = await new Promise<{
        title: string
        uploadDate: string
        uploader: string
        duration: string
        viewCount: number
        likeCount: number
        thumbnail: string
        captions: Record<string, { ext: string; url: string; name: string | null }[]>
        auto_captions: Record<string, { ext: string; url: string; name: string | null }[]>
      }>((resolve, reject) => {
        exec(
          `${process.cwd()}/src/core/bin/yt-dlp --skip-download --write-subs --write-auto-subs --sub-langs all --sub-format json3 --print-json "https://www.youtube.com/watch?v=${id}"`,
          (err, stdout) => {
            if (err) {
              reject(err)
              return
            }

            try {
              const data = JSON.parse(stdout)
              const captions: Record<string, { ext: string; url: string; name: string | null }[]> = {}
              const auto_captions: Record<string, { ext: string; url: string; name: string | null }[]> = {}

              if (data.subtitles) {
                for (const [lang, subs] of Object.entries(data.subtitles) as [string, any[]][]) {
                  captions[lang] = subs.map((s: any) => ({
                    ext: s.ext || 'json3',
                    url: s.url || '',
                    name: s.name || null
                  }))
                }
              }

              if (data.automatic_captions) {
                for (const [lang, subs] of Object.entries(data.automatic_captions) as [string, any[]][]) {
                  auto_captions[lang] = subs.map((s: any) => ({
                    ext: s.ext || 'json3',
                    url: s.url || '',
                    name: s.name || null
                  }))
                }
              }

              resolve({
                title: data.title || '',
                uploadDate: data.upload_date || '',
                uploader: data.uploader || '',
                duration: String(data.duration || 0),
                viewCount: Number(data.view_count || 0),
                likeCount: Number(data.like_count || 0),
                thumbnail: data.thumbnail || '',
                captions,
                auto_captions
              })
            } catch (parseErr) {
              reject(parseErr)
            }
          }
        )
      })

      return response.ok(result)
    } catch {
      return response.ok({
        title: '',
        uploadDate: '',
        uploader: '',
        duration: '0',
        viewCount: 0,
        likeCount: 0,
        thumbnail: '',
        captions: {},
        auto_captions: {}
      })
    }
  })

export const summarize = forge.mutation({
  description: 'Summarize a YouTube transcript URL',
  input: {
    body: z.object({
      url: z.string().url()
    })
  },
  output: {
    OK: z.string(),
    BAD_REQUEST: z.string()
  }
}).callback(async ({ body: { url }, core: { api: { fetchAI } }, pb, response }) => {
  const captionText = (await fetch(url).then(result => result.text()))
    .replace(/\n/g, ' ')
    .replace(/ +/g, ' ')
    .match(/<text.*?>(.*?)<\/text>/g)
    ?.map(text => text.replace(/<text.*?>|<\/text>/g, ''))
    .join(' ')

  if (!captionText) return response.badRequest('No captions found')

  const result = await fetchAI({
    pb,
    provider: 'groq',
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: 'Summarize this video transcript concisely.' },
      { role: 'user', content: captionText }
    ]
  })

  return result ? response.ok(result) : response.badRequest('No result found')
})

export default { getYoutubeVideoInfo, summarize }
