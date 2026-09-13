import { exec, spawn } from 'child_process'
import fs from 'fs'
import z from 'zod'

import forge from '../forge'

export const getVideoInfo = forge
  .query({
    description: 'Retrieve YouTube video metadata',
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
        thumbnail: z.string()
      })
    }
  })
  .callback(async ({ query: { id }, response }) => {
    const result = await new Promise<{
      title: string
      uploadDate: string
      uploader: string
      duration: string
      viewCount: number
      likeCount: number
      thumbnail: string
    }>((resolve, reject) => {
      exec(
        `${process.cwd()}/src/core/bin/yt-dlp --skip-download --print "title,upload_date,uploader,duration,view_count,like_count,thumbnail" "https://www.youtube.com/watch?v=${id}"`,
        (err, stdout) => {
          if (err) {
            reject(err)

            return
          }

          const [
            title,
            uploadDate,
            uploader,
            duration,
            viewCount,
            likeCount,
            thumbnail
          ] = stdout.split('\n')

          resolve({
            title,
            uploadDate,
            uploader,
            duration,
            viewCount: Number(viewCount),
            likeCount: Number(likeCount),
            thumbnail
          })
        }
      )
    })

    return response.ok(result)
  })

export const downloadVideo = forge
  .mutation({
    description: 'Download YouTube video as audio asynchronously',
    input: {
      query: z.object({
        id: z.string()
      }),
      body: z.object({
        title: z.string(),
        uploader: z.string(),
        duration: z.number()
      })
    },
    output: {
      OK: z.string()
    }
  })
  .callback(
    async ({
      pb,
      query: { id },
      body: { title, uploader, duration },
      core: { tasks },
      io,
      response
    }) => {
      const downloadID = tasks.add(io, {
        module: 'music',
        description: 'Downloading YouTube video with name: ' + title,
        status: 'pending',
        progress: 'Initializing download'
      })

      const downloadProcess = spawn(`${process.cwd()}/src/core/bin/yt-dlp`, [
        '-f',
        'bestaudio',
        '-o',
        `${process.cwd()}/medium/${downloadID}-%(title)s.%(ext)s`,
        '--extract-audio',
        '--audio-format',
        'mp3',
        '--audio-quality',
        '0',
        `https://www.youtube.com/watch?v=${id}`
      ])

      downloadProcess.on('error', err => {
        tasks.update(io, downloadID, {
          status: 'failed',
          error: err instanceof Error ? err.message : String(err)
        })
      })

      downloadProcess.stdout.on('data', data => {
        const message = data.toString().trim()

        if (
          ['[youtube]', '[download]', '[ExtractAudio]'].some(prefix =>
            message.startsWith(prefix)
          )
        ) {
          tasks.update(io, downloadID, {
            status: 'running',
            progress: message
          })
        }
      })

      downloadProcess.on('close', async () => {
        try {
          const allFiles = fs.readdirSync(`${process.cwd()}/medium`)

          const mp3File = allFiles.find(file => file.startsWith(downloadID))

          if (!mp3File) {
            tasks.update(io, downloadID, {
              status: 'failed'
            })

            return
          }

          const fileBuffer = fs.readFileSync(
            `${process.cwd()}/medium/${mp3File}`
          )

          await pb.create
            .collection('entries')
            .data({
              name: title,
              author: uploader,
              duration,
              file: new File(
                [fileBuffer],
                mp3File.split('-').slice(1).join('-')
              )
            })
            .execute()

          fs.unlinkSync(`${process.cwd()}/medium/${mp3File}`)

          tasks.update(io, downloadID, {
            status: 'completed'
          })
        } catch (error) {
          tasks.update(io, downloadID, {
            status: 'failed',
            error: error instanceof Error ? error.message : String(error)
          })
        }
      })

      return response.ok(downloadID)
    }
  )

const PROMPT =
  'Given a video title and uploader, extract the music title (from the video title if possible, otherwise use the whole title) and author (use composer/lyricist or original artist if mentioned, otherwise use your knowledge to identify the most likely original author; if the title is generic, choose the most widely recognized author). Do not list the uploader as author unless it is clearly original. If author is unknown, write “Unknown”. If additional context is given in the title (like "theme song of ...", "from ...", "cover of ..."), put that in parentheses after the title.'

export const parseMusicNameAndAuthor = forge
  .mutation({
    description: 'Extract music title and author from YouTube video using AI',
    input: {
      body: z.object({
        title: z.string(),
        uploader: z.string()
      })
    },
    output: {
      OK: z
        .object({
          name: z.string(),
          author: z.string()
        })
        .nullable()
    }
  })
  .callback(
    async ({
      body: { title, uploader },
      pb,
      core: {
        api: { fetchAI }
      },
      response
    }) => {
      const aiResponse = await fetchAI({
        pb,
        provider: 'openai',
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: PROMPT
          },
          {
            role: 'user',
            content: `Title: ${title}\nUploader: ${uploader}`
          }
        ],
        structure: z.object({
          name: z.string(),
          author: z.string()
        })
      })

      return response.ok(aiResponse)
    }
  )
