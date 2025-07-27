import { PBService } from '@functions/database'
import { updateTaskInPool } from '@middlewares/taskPoolMiddleware'
import { SCHEMAS } from '@schema'
import fs from 'fs'
import { Server } from 'socket.io'
import { z } from 'zod/v4'

export const processDownloadedFiles = async (
  pb: PBService,
  io: Server,
  taskId: string,
  md5: string,
  metadata: Omit<
    z.infer<typeof SCHEMAS.books_library.entries>,
    | 'thumbnail'
    | 'file'
    | 'is_favourite'
    | 'is_read'
    | 'time_finished'
    | 'created'
    | 'updated'
    | 'collection'
    | 'md5'
  > & {
    thumbnail: string | File
    file?: File
    collection?: string
  }
): Promise<void> => {
  if (!fs.existsSync(`./medium/${md5}.${metadata.extension}`)) {
    updateTaskInPool(io, taskId, {
      status: 'failed',
      error: 'Downloaded file not found'
    })

    return
  }

  try {
    await fetch(metadata.thumbnail as string).then(async response => {
      if (response.ok) {
        const buffer = await response.arrayBuffer()

        metadata.thumbnail = new File([buffer], 'image.jpg', {
          type: 'image/jpeg'
        })
      }
    })

    const file = fs.readFileSync('./medium/' + md5 + '.' + metadata.extension)

    if (!file) throw new Error('Failed to read file')
    metadata.file = new File([file], `${md5}.${metadata.extension}`)
    metadata.size = file.byteLength

    await pb.create
      .collection('books_library__entries')
      .data(metadata)
      .execute()

    updateTaskInPool(io, taskId, {
      status: 'completed'
    })

    fs.unlinkSync(`./medium/${md5}.${metadata.extension}`)
  } catch (error) {
    fs.unlinkSync(`./medium/${md5}.${metadata.extension}`)
    throw error
  }
}
