import { PBService } from '@functions/database'
import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'
import { uploadMiddleware } from '@middlewares/uploadMiddleware'
import fs from 'fs'
import { z } from 'zod/v4'

import { convertToMp3 } from '../utils/convertToMP3'

const list = forgeController.query
  .description('Get all moment vault entries')
  .input({
    query: z.object({
      page: z
        .string()
        .optional()
        .transform(val => parseInt(val ?? '1', 10) || 1)
    })
  })
  .callback(async ({ pb, query: { page } }) =>
    pb.getList
      .collection('moment_vault__entries')
      .page(page)
      .perPage(10)
      .sort(['-created'])
      .execute()
  )

export const createAudioEntry = async (
  pb: PBService,
  {
    file,
    transcription
  }: {
    file: Express.Multer.File
    transcription?: string
  }
) => {
  if (file.mimetype !== 'audio/mp3') {
    file.path = await convertToMp3(file.path)
  }

  const fileBuffer = fs.readFileSync(file.path)

  const entry = await pb.create
    .collection('moment_vault__entries')
    .data({
      type: 'audio',
      file: new File([fileBuffer], file.path.split('/').pop() || 'audio.mp3'),
      transcription
    })
    .execute()

  fs.unlinkSync(file.path)

  return entry
}

export const createTextEntry = async (pb: PBService, content: string) =>
  pb.create
    .collection('moment_vault__entries')
    .data({
      type: 'text',
      content
    })
    .execute()

export const createPhotosEntry = async (
  pb: PBService,
  files: Express.Multer.File[]
) => {
  const allImages = files.map(file => {
    const fileBuffer = fs.readFileSync(file.path)

    return new File([fileBuffer], file.path.split('/').pop() || 'photo.jpg')
  })

  const entry = await pb.create
    .collection('moment_vault__entries')
    .data({
      type: 'photos',
      file: allImages
    })
    .execute()

  return entry
}

const create = forgeController.mutation
  .description('Create a new moment vault entry')
  .input({
    body: z.object({
      type: z.enum(['text', 'audio', 'photos']),
      content: z.string().optional(),
      transcription: z.string().optional()
    })
  })
  .middlewares(uploadMiddleware)
  .statusCode(201)
  .callback(async ({ pb, body: { type, content, transcription }, req }) => {
    if (type === 'audio') {
      const { files } = req as {
        files: Express.Multer.File[]
      }

      if (!files?.length) {
        throw new ClientError('No file uploaded')
      }

      if (files.length > 1) {
        throw new ClientError('Only one audio file is allowed')
      }

      if (!files[0].mimetype.startsWith('audio/')) {
        throw new ClientError('File must be an audio file')
      }

      return await createAudioEntry(pb, {
        file: files[0],
        transcription
      })
    }

    if (type === 'text') {
      if (!content) {
        throw new ClientError('Content is required for text entries')
      }

      return await createTextEntry(pb, content)
    }

    if (type === 'photos') {
      const { files } = req as {
        files: Express.Multer.File[]
      }

      if (!files?.length) {
        throw new ClientError('No files uploaded')
      }

      return await createPhotosEntry(pb, files)
    }
    throw new ClientError('Invalid entry type')
  })

const update = forgeController.mutation
  .description('Update a moment vault entry')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: z.object({
      content: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'moment_vault__entries'
  })
  .callback(({ pb, query: { id }, body: { content } }) =>
    pb.update
      .collection('moment_vault__entries')
      .id(id)
      .data({ content })
      .execute()
  )

const remove = forgeController.mutation
  .description('Delete a moment vault entry')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'moment_vault__entries'
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('moment_vault__entries').id(id).execute()
  )

export default forgeRouter({
  list,
  create,
  update,
  remove
})
