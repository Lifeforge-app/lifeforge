import fs from 'fs'
import z from 'zod'

import { type IPBService } from '@lifeforge/pocketbase'

import forge from '../forge'
import schema from '../schema'
import { convertToMp3 } from '../utils/convertToMP3'

export const list = forge
  .query({
    description: 'Get paginated list of moment vault entries',
    input: {
      query: z.object({
        page: z.string().optional().default('1')
      })
    },
    output: {
      OK: z.object({
        items: z.array(schema.entries),
        page: z.number(),
        perPage: z.number(),
        totalItems: z.number(),
        totalPages: z.number()
      })
    }
  })
  .callback(async ({ pb, query: { page }, response }) => {
    const parsedPage = parseInt(page ?? '1', 10) || 1

    return response.ok(
      await pb.getList
        .collection('entries')
        .page(parsedPage)
        .perPage(10)
        .sort(['-created'])
        .execute()
    )
  })

const createAudioEntry = async (
  pb: IPBService<typeof schema>,
  {
    file,
    transcription
  }: {
    file: any
    transcription?: string
  }
) => {
  if (file.mimetype !== 'audio/mp3') {
    file.path = await convertToMp3(file.path)
  }

  const fileBuffer = fs.readFileSync(file.path)

  const entry = await pb.create
    .collection('entries')
    .data({
      type: 'audio',
      file: new File([fileBuffer], file.path.split('/').pop() || 'audio.mp3'),
      transcription
    })
    .execute()

  fs.unlinkSync(file.path)

  return entry
}

const createTextEntry = async (
  pb: IPBService<typeof schema>,
  content: string
) =>
  pb.create
    .collection('entries')
    .data({
      type: 'text',
      content
    })
    .execute()

const createPhotosEntry = async (
  pb: IPBService<typeof schema>,
  files: any[]
) => {
  const allImages = files.map(file => {
    const fileBuffer = fs.readFileSync(file.path)

    return new File([fileBuffer], file.path.split('/').pop() || 'photo.jpg')
  })

  const entry = await pb.create
    .collection('entries')
    .data({
      type: 'photos',
      file: allImages
    })
    .execute()

  return entry
}

export const create = forge
  .mutation({
    description: 'Create a new moment vault entry',
    input: {
      body: z.object({
        type: z.enum(['text', 'audio', 'photos']),
        content: z.string().optional(),
        transcription: z.string().optional()
      })
    },
    media: {
      files: {
        multiple: true,
        optional: true
      }
    },
    output: {
      CREATED: schema.entries,
      BAD_REQUEST: z.string()
    }
  })
  .callback(
    async ({
      pb,
      body: { type, content, transcription },
      media: { files },
      response
    }) => {
      if (type === 'audio') {
        if (!files?.length) {
          return response.badRequest('No file uploaded')
        }

        if (files.length > 1) {
          return response.badRequest('Only one audio file is allowed')
        }

        if (!files[0].mimetype.startsWith('audio/')) {
          return response.badRequest('File must be an audio file')
        }

        return response.created(
          await createAudioEntry(pb, {
            file: files[0],
            transcription
          })
        )
      }

      if (type === 'text') {
        if (!content) {
          return response.badRequest('Content is required for text entries')
        }

        return response.created(await createTextEntry(pb, content))
      }

      if (type === 'photos') {
        if (!files?.length) {
          return response.badRequest('No files uploaded')
        }

        return response.created(await createPhotosEntry(pb, files))
      }

      return response.badRequest('Invalid entry type')
    }
  )

export const update = forge
  .mutation({
    description: 'Update content of a moment vault entry',
    input: {
      query: z.object({
        id: z.string()
      }),
      body: z.object({
        content: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'entries' }
    },
    output: {
      OK: schema.entries,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, body: { content }, response }) =>
    response.ok(
      await pb.update.collection('entries').id(id).data({ content }).execute()
    )
  )

export const toggleReviewed = forge
  .mutation({
    description: 'Toggle reviewed status of an audio entry',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'entries' }
    },
    output: {
      OK: schema.entries,
      BAD_REQUEST: z.string(),
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    const entry = await pb.getOne.collection('entries').id(id).execute()

    if (entry.type !== 'audio') {
      return response.badRequest(
        'Reviewed status can only be toggled for audio entries'
      )
    }

    return response.ok(
      await pb.update
        .collection('entries')
        .id(id)
        .data({
          reviewed: !entry.reviewed
        })
        .execute()
    )
  })

export const remove = forge
  .mutation({
    description: 'Delete a moment vault entry',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'entries' }
    },
    output: {
      NO_CONTENT: true,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    await pb.delete.collection('entries').id(id).execute()

    return response.noContent()
  })
