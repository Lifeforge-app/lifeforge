import { PBService } from '@functions/database'
import { updateTaskInPool } from '@functions/socketio/taskPool'
import { SCHEMAS } from '@schema'
import { countWords } from 'epub-wordcount'
import fs from 'fs'
// @ts-expect-error - No types available
import pdfPageCounter from 'pdf-page-counter'
import { Server } from 'socket.io'
import z from 'zod'

export const processDownloadedFiles = async (
  pb: PBService,
  io: Server,
  taskId: string,
  md5: string,
  metadata: Omit<
    z.infer<typeof SCHEMAS.books_library.entries.schema>,
    | 'thumbnail'
    | 'file'
    | 'is_favourite'
    | 'read_status'
    | 'time_started'
    | 'time_finished'
    | 'created'
    | 'updated'
    | 'collection'
    | 'md5'
    | 'page_count'
    | 'word_count'
  > & {
    thumbnail: string | File
    file?: File | string
    collection?: string
    page_count?: number
    word_count?: number
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

    if (metadata.extension === 'epub') {
      metadata.word_count = await countWords(
        './medium/' + md5 + '.' + metadata.extension
      )
    } else if (metadata.extension === 'pdf') {
      metadata.page_count = (await pdfPageCounter(file)).numpages
    }

    await pb.create
      .collection('books_library__entries')
      .data({
        ...metadata,
        md5
      })
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
