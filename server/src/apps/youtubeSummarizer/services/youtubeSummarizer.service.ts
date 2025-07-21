import { fetchAI } from '@functions/fetchAI'
import { exec } from 'child_process'
import Pocketbase from 'pocketbase'

import { YoutubeSummarizerCustomSchemas } from 'shared/types/collections'

export const getYoutubeVideoInfo = (
  videoId: string
): Promise<YoutubeSummarizerCustomSchemas.IYoutubeInfo> => {
  return new Promise((resolve, reject) => {
    exec(
      `${process.cwd()}/src/core/bin/yt-dlp --skip-download --dump-json "https://www.youtube.com/watch?v=${videoId}"`,
      (err, stdout) => {
        if (err) {
          reject(err)

          return
        }

        try {
          const data = JSON.parse(stdout)

          const response: YoutubeSummarizerCustomSchemas.IYoutubeInfo = {
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
}

export const summarizeVideo = async (
  url: string,
  pb: Pocketbase
): Promise<string> => {
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
}
