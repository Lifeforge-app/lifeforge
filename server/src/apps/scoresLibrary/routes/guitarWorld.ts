import { forgeController, forgeRouter } from '@functions/routes'
import {
  addToTaskPool,
  updateTaskInPool
} from '@middlewares/taskPoolMiddleware'
import fs from 'fs'
import PDFDocument from 'pdfkit'
import sharp from 'sharp'
import { z } from 'zod/v4'

const list = forgeController.query
  .description('Get tabs list from Guitar World')
  .input({
    query: z.object({
      cookie: z.string(),
      page: z
        .string()
        .optional()
        .transform(val => parseInt(val ?? '1', 10) || 1)
    })
  })
  .callback(async ({ query: { cookie, page } }) => {
    const data: {
      data: {
        list: {
          qupu: {
            id: number
            name: string
            sub_title: string
            category_txt: string
            main_artist: string
            creator_name: string
            audio: string
          }
        }[]
        total: number
        page_size: number
      }
    } = await fetch(
      `https://user.guitarworld.com.cn/user/pu/my/pu_list?page=${page}`,
      {
        headers: {
          cookie
        }
      }
    ).then(res => {
      return res.json()
    })

    return {
      data: data.data.list
        .map(item => item.qupu)
        .map(item => ({
          id: item.id,
          name: item.name,
          subtitle: item.sub_title,
          category: item.category_txt,
          mainArtist: item.main_artist,
          uploader: item.creator_name,
          audioUrl: item.audio
        })),
      totalItems: data.data.total,
      perPage: data.data.page_size
    }
  })

const download = forgeController.mutation
  .description('Download a guitar tab from Guitar World')
  .input({
    body: z.object({
      cookie: z.string(),
      id: z.number(),
      name: z.string(),
      category: z.string(),
      mainArtist: z.string(),
      audioUrl: z.string()
    })
  })
  .statusCode(202)
  .callback(
    async ({
      pb,
      body: { cookie, id, name, category, mainArtist, audioUrl },
      io
    }) => {
      const taskId = addToTaskPool(io, {
        module: 'scoresLibrary',
        description: `Downloading tab ${name} (${id}) from Guitar World`,
        status: 'pending'
      })

      ;(async () => {
        try {
          updateTaskInPool(io, taskId, {
            status: 'running',
            progress: 0
          })

          const rawHTML = await fetch(
            'https://user.guitarworld.com.cn/user/pu/my/' + id,
            {
              method: 'GET',
              headers: {
                cookie
              }
            }
          ).then(res => res.text())

          const picObject = JSON.parse(
            rawHTML.match(/window\.(?:picList|picObj) = (.*?);/)?.[1] || '[]'
          )

          const pics = Array.isArray(picObject[0]) ? picObject[0] : picObject

          if (pics.length === 0) {
            throw new Error('No pictures found for this tab')
          }

          const folder = `./medium/${id}`

          if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder)
          }

          for (let i = 0; i < pics.length; i++) {
            const arrayBuffer = await fetch(pics[i], {
              method: 'GET',
              headers: {
                cookie
              }
            }).then(res => res.arrayBuffer())

            fs.writeFileSync(
              `./medium/${id}/${i}.jpg`,
              Buffer.from(arrayBuffer)
            )
          }

          const doc = new PDFDocument({ autoFirstPage: false })

          const writeStream = fs.createWriteStream('./medium/' + id + '.pdf')

          doc.pipe(writeStream)

          const images = fs
            .readdirSync(folder)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map(e => folder + '/' + e)

          for (const image of images) {
            const imageBuffer = await sharp(image).png().toBuffer()

            const { width, height } = await sharp(imageBuffer).metadata()

            doc.addPage({ size: [width!, height!] })
            doc.image(imageBuffer, 0, 0, { width, height })
          }

          doc.end()

          writeStream.on('finish', async () => {
            const audioBuffer = await fetch(audioUrl).then(res =>
              res.arrayBuffer()
            )

            if (!fs.existsSync(`./medium/${id}.pdf`)) {
              throw new Error('PDF file not found')
            }

            const newEntry = await pb.create
              .collection('scores_library__entries')
              .data({
                name,
                author: mainArtist,
                pageCount: images.length,
                audio: new File([Buffer.from(audioBuffer)], `${id}.mp3`),
                pdf: new File(
                  [fs.readFileSync(`./medium/${id}.pdf`)],
                  `${id}.pdf`
                ),
                type: (() => {
                  switch (category) {
                    case '弹唱吉他谱':
                      return 'singalong'
                    case '指弹吉他谱':
                      return 'fingerstyle'
                    default:
                      return ''
                  }
                })(),
                thumbnail: new File(
                  [fs.readFileSync(`./medium/${id}/0.jpg`)],
                  `${id}.jpeg`
                )
              })

            fs.rmdirSync(folder, { recursive: true })
            fs.unlinkSync(`./medium/${id}.pdf`)

            updateTaskInPool(io, taskId, {
              status: 'completed',
              data: newEntry
            })
          })
        } catch (error) {
          updateTaskInPool(io, taskId, {
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      })()

      return taskId
    }
  )

export default forgeRouter({
  list,
  download
})
