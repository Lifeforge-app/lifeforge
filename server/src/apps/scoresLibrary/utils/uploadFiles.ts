import { PBService } from '@functions/database'
import {
  globalTaskPool,
  updateTaskInPool
} from '@middlewares/taskPoolMiddleware'
import fs from 'fs'
// @ts-expect-error - No types available
import pdfPageCounter from 'pdf-page-counter'
import pdfThumbnail from 'pdf-thumbnail'
import { Server } from 'socket.io'

import { left, setLeft } from '../routes/entries'

export const processFiles = async (
  pb: PBService,
  groups: Record<
    string,
    {
      pdf: Express.Multer.File | null
      mscz: Express.Multer.File | null
      mp3: Express.Multer.File | null
    }
  >,
  io: Server,
  taskId: string
) => {
  for (let groupIdx = 0; groupIdx < Object.keys(groups).length; groupIdx++) {
    try {
      const group = groups[Object.keys(groups)[groupIdx]]

      const file = group.pdf!

      const decodedName = decodeURIComponent(file.originalname)

      const name = decodedName.split('.').slice(0, -1).join('.')

      const path = file.path

      const buffer = fs.readFileSync(path)

      const thumbnail = await pdfThumbnail(buffer, {
        compress: {
          type: 'JPEG',
          quality: 70
        }
      })

      const { numpages } = await pdfPageCounter(buffer)

      thumbnail
        .pipe(fs.createWriteStream(`medium/${decodedName}.jpg`))
        .once('close', async () => {
          try {
            const thumbnailBuffer = fs.readFileSync(`medium/${decodedName}.jpg`)

            const otherFiles: {
              audio: File | null
              musescore: File | null
            } = {
              audio: null,
              musescore: null
            }

            if (group.mscz) {
              otherFiles.musescore = new File(
                [fs.readFileSync(group.mscz.path)],
                group.mscz.originalname
              )
            }

            if (group.mp3) {
              otherFiles.audio = new File(
                [fs.readFileSync(group.mp3.path)],
                group.mp3.originalname
              )
            }

            await pb.create
              .collection('scores_library__entries')
              .data({
                name,
                thumbnail: new File([thumbnailBuffer], `${decodedName}.jpeg`),
                author: '',
                pdf: new File([buffer], decodedName),
                pageCount: numpages,
                ...otherFiles
              })
              .execute()

            fs.unlinkSync(path)
            fs.unlinkSync(`medium/${decodedName}.jpg`)

            if (group.mscz) {
              fs.unlinkSync(group.mscz.path)
            }

            if (group.mp3) {
              fs.unlinkSync(group.mp3.path)
            }

            if (!(globalTaskPool[taskId].progress instanceof Object)) {
              return
            }

            setLeft(left - 1)

            if (left === 0) {
              updateTaskInPool(io, taskId, {
                status: 'completed'
              })
            } else {
              updateTaskInPool(io, taskId, {
                status: 'running',
                progress: {
                  left,
                  total: Object.keys(groups).length
                }
              })
            }
          } catch (err) {
            updateTaskInPool(io, taskId, {
              status: 'failed',
              error: err instanceof Error ? err.message : 'Unknown error'
            })

            fs.unlinkSync(path)
            fs.unlinkSync(`medium/${decodedName}.jpg`)

            if (group.mscz) {
              fs.unlinkSync(group.mscz.path)
            }

            if (group.mp3) {
              fs.unlinkSync(group.mp3.path)
            }
          }
        })
    } catch (err) {
      console.error('Error processing group:', err)
      updateTaskInPool(io, taskId, {
        status: 'failed',
        error: err instanceof Error ? err.message : 'Unknown error'
      })

      const allFilesLeft = fs.readdirSync('medium')

      for (const file of allFilesLeft) {
        fs.unlinkSync(`medium/${file}`)
      }

      break
    }
  }
}
