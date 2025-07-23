import { PBService } from '@functions/database'
import { updateTaskInPool } from '@middlewares/taskPoolMiddleware'
import fs from 'fs'
import { Server } from 'socket.io'

import { BooksLibraryCollectionsSchemas } from 'shared/types/collections'

export const processDownloadedFiles = async (
  pb: PBService,
  io: Server,
  taskId: string,
  md5: string,
  metadata: Omit<
    BooksLibraryCollectionsSchemas.IEntry,
    'thumbnail' | 'file' | 'is_favourite' | 'is_read' | 'time_finished'
  > & {
    thumbnail: string | File
    file?: File
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
