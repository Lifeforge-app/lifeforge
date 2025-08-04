import { forgeController, forgeRouter } from '@functions/routes'
import {
  addToTaskPool,
  updateTaskInPool
} from '@middlewares/taskPoolMiddleware'
import { exec, spawn } from 'child_process'
import fs from 'fs'
import z from 'zod/v4'

const getVideoInfo = forgeController.query
  .description('Get YouTube video information')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .callback(async ({ query: { id } }) => {
    return new Promise<{
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
  })

const downloadVideo = forgeController.mutation
  .description('Download YouTube video asynchronously')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: z.object({
      title: z.string(),
      uploader: z.string(),
      duration: z.number()
    })
  })
  .callback(
    async ({ pb, query: { id }, body: { title, uploader, duration }, io }) => {
      const downloadID = addToTaskPool(io, {
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
        updateTaskInPool(io, downloadID, {
          status: 'failed',
          error: err instanceof Error ? err.message : String(err)
        })
      })

      downloadProcess.stdout.on('error', err => {
        updateTaskInPool(io, downloadID, {
          status: 'failed',
          error: err instanceof Error ? err.message : String(err)
        })
      })

      downloadProcess.stderr.on('data', data => {
        const message = data.toString().trim()

        if (
          ['[youtube]', '[download]', '[ExtractAudio]'].some(prefix =>
            message.startsWith(prefix)
          )
        ) {
          updateTaskInPool(io, downloadID, {
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
            updateTaskInPool(io, downloadID, {
              status: 'failed'
            })

            return
          }

          const fileBuffer = fs.readFileSync(
            `${process.cwd()}/medium/${mp3File}`
          )

          await pb.create
            .collection('music__entries')
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

          updateTaskInPool(io, downloadID, {
            status: 'completed'
          })
        } catch (error) {
          updateTaskInPool(io, downloadID, {
            status: 'failed',
            error: error instanceof Error ? error.message : String(error)
          })
        }
      })

      return downloadID
    }
  )
  .statusCode(202)

export default forgeRouter({
  getVideoInfo,
  downloadVideo
})
