/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchAI } from '@functions/external/ai'
import { forgeController, forgeRouter } from '@functions/routes'
import { exec } from 'child_process'
import { z } from 'zod/v4'

export interface YoutubeInfo {
  title: string
  uploadDate: string
  uploader: string
  uploaderUrl?: string
  duration: string
  viewCount: number
  likeCount: number
  thumbnail: string
  captions?: Record<string, any>
  auto_captions?: Record<string, any>
}

const getYoutubeVideoInfo = forgeController.query
  .description('Get YouTube video information by video ID')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .callback(
    ({ query: { id } }) =>
      new Promise<YoutubeInfo>((resolve, reject) => {
        exec(
          `${process.cwd()}/src/core/bin/yt-dlp --skip-download --dump-json "https://www.youtube.com/watch?v=${id}"`,
          (err, stdout) => {
            if (err) {
              reject(err)

              return
            }

            try {
              const data = JSON.parse(stdout)

              const response: YoutubeInfo = {
                title: data.title,
                uploadDate: data.upload_date,
                uploader: data.uploader,
                uploaderUrl: data.uploader_url,
                duration: data.duration.toString(),
                viewCount: data.view_count,
                likeCount: data.like_count || 0,
                thumbnail: data.thumbnail,
                captions:
                  Object.fromEntries(
                    Object.entries(data.subtitles).filter(([, values]) => {
                      return (values as any[]).map(e => e.name).filter(Boolean)
                        .length
                    })
                  ) || {},
                auto_captions: data.automatic_captions || {}
              }

              resolve(response)
            } catch (error) {
              reject(error)
            }
          }
        )
      })
  )

const summarizeVideo = forgeController.mutation
  .description('Summarize a YouTube video from URL')
  .input({
    body: z.object({
      url: z.string().url('Invalid YouTube URL')
    })
  })
  .callback(async ({ body: { url }, pb }) => {
    const rawCaptions = await fetch(url).then(res => res.text())

    const captionText = rawCaptions
      .replace(/\n/g, ' ')
      .replace(/ +/g, ' ')
      .match(/<text.*?>(.*?)<\/text>/g)
      ?.map(e => {
        return e.replace(/<text.*?>|<\/text>/g, '')
      })
      .join(' ')

    if (!captionText) {
      throw new Error('No captions found')
    }

    const result = await fetchAI({
      pb,
      provider: 'groq',
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content:
            'Please provide a concise summary of the following video transcript in a single paragraph, capturing the main points and key details without reproducing the transcript verbatim. Focus on the core message, significant events, or arguments presented, and ensure the summary is clear, coherent, and informative for someone who hasn’t watched the video. The summary must be written in the same language as the transcript and can utilize Markdown formatting—such as bullet points, bold text, or other styles—when deemed appropriate to enhance clarity or emphasis.'
        },
        {
          role: 'user',
          content: captionText
        }
      ]
    })

    if (!result) {
      throw new Error('No result found')
    }

    return result
  })

export default forgeRouter({
  getYoutubeVideoInfo,
  summarizeVideo
})
