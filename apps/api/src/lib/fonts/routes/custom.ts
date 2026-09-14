import { eq } from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-orm/zod'
import z from 'zod'

import forge from '../forge'
import { userFontFamilyUpload } from '../schema.drizzle'

const VALID_FONT_EXTENSIONS = ['.ttf', '.otf', '.woff', '.woff2']

function isValidFontFile(filename: string): boolean {
  const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'))

  return VALID_FONT_EXTENSIONS.includes(ext)
}

const fontUploadSchema = createSelectSchema(userFontFamilyUpload).extend({
  created: z.string(),
  updated: z.string()
})

export const list = forge
  .query({
    description: 'List all custom uploaded fonts',
    input: {},
    output: {
      OK: z.array(fontUploadSchema)
    }
  })
  .callback(async ({ db, response }) => {
    const records = await db.query.userFontFamilyUpload.findMany()

    return response.ok(
      records.map(record => ({
        id: record.id,
        displayName: record.displayName,
        family: record.family,
        file: record.file,
        weight: record.weight,
        created: record.created.toISOString(),
        updated: record.updated.toISOString()
      }))
    )
  })

export const get = forge
  .query({
    description: 'Get a specific custom font by ID',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    output: {
      OK: fontUploadSchema,
      NOT_FOUND: true
    }
  })
  .callback(async ({ db, query: { id }, response }) => {
    const record = await db.query.userFontFamilyUpload.findFirst({
      where: { id }
    })

    if (!record) {
      return response.notFound()
    }

    return response.ok({
      id: record.id,
      displayName: record.displayName,
      family: record.family,
      file: record.file,
      weight: record.weight,
      created: record.created.toISOString(),
      updated: record.updated.toISOString()
    })
  })

export const upload = forge
  .mutation({
    description: 'Upload a new custom font',
    input: {
      query: z.object({
        id: z.string().optional()
      }),
      body: z.object({
        displayName: z.string().min(1, 'Display name is required'),
        family: z.string().min(1, 'Font family is required'),
        weight: z.number().min(100).max(900).default(400)
      })
    },
    media: {
      file: {
        optional: false
      }
    },
    output: {
      OK: fontUploadSchema,
      BAD_REQUEST: z.string(),
      NOT_FOUND: true
    }
  })
  .callback(
    async ({
      db,
      query: { id },
      body: { displayName, family, weight },
      media: { file },
      core,
      response
    }) => {
      if (!file || typeof file === 'string') {
        return response.badRequest('A valid font file must be uploaded')
      }

      const originalname =
        'originalname' in file && typeof file.originalname === 'string'
          ? file.originalname
          : ''

      if (!isValidFontFile(originalname)) {
        return response.badRequest(
          'Invalid file type. Only TTF, OTF, WOFF, and WOFF2 files are allowed.'
        )
      }

      let existingFileKey: string | undefined
      if (id) {
        const existing = await db.query.userFontFamilyUpload.findFirst({
          where: { id }
        })
        if (!existing) {
          return response.notFound()
        }
        existingFileKey = existing.file
      }

      const fileKey = await core.storage.save({
        file,
        currentKey: existingFileKey,
        table: 'userFontFamilyUpload',
        field: 'file'
      })

      if (!fileKey) {
        return response.badRequest('Failed to save font file')
      }

      if (id) {
        const [updated] = await db
          .update(userFontFamilyUpload)
          .set({
            displayName,
            family,
            weight,
            file: fileKey,
            updated: new Date()
          })
          .where(eq(userFontFamilyUpload.id, id))
          .returning()

        return response.ok({
          id: updated.id,
          displayName: updated.displayName,
          family: updated.family,
          file: updated.file,
          weight: updated.weight,
          created: updated.created.toISOString(),
          updated: updated.updated.toISOString()
        })
      }

      const [created] = await db
        .insert(userFontFamilyUpload)
        .values({
          displayName,
          family,
          weight,
          file: fileKey
        })
        .returning()

      return response.ok({
        id: created.id,
        displayName: created.displayName,
        family: created.family,
        file: created.file,
        weight: created.weight,
        created: created.created.toISOString(),
        updated: created.updated.toISOString()
      })
    }
  )

export const remove = forge
  .mutation({
    description: 'Delete a custom font',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    output: {
      NO_CONTENT: true,
      NOT_FOUND: true
    }
  })
  .callback(async ({ db, core, query: { id }, response }) => {
    const record = await db.query.userFontFamilyUpload.findFirst({
      where: { id }
    })

    if (!record) {
      return response.notFound()
    }

    if (record.file) {
      await core.storage.delete(record.file)
    }

    await db
      .delete(userFontFamilyUpload)
      .where(eq(userFontFamilyUpload.id, id))

    return response.noContent()
  })
