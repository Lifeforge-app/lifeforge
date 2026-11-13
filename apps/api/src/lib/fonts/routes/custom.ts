import { eq } from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-orm/zod'
import z from 'zod'

import { fileReferenceSchema } from '@lifeforge/file-storage'

import forge from '../forge'
import { fontsFontFamilyUpload } from '../schema.drizzle'

const VALID_FONT_EXTENSIONS = ['.ttf', '.otf', '.woff', '.woff2']

function isValidFontFile(filename: string): boolean {
  const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'))

  return VALID_FONT_EXTENSIONS.includes(ext)
}

const fontUploadSchema = createSelectSchema(fontsFontFamilyUpload)
  .omit({ file: true })
  .extend({
    file: fileReferenceSchema.nullable()
  })

export const list = forge
  .query({
    description: 'List all custom uploaded fonts',
    input: {},
    output: {
      OK: z.array(fontUploadSchema)
    }
  })
  .callback(async ({ db, core, response }) => {
    const records = await db.query.fontsFontFamilyUpload.findMany()

    return response.ok(
      await Promise.all(
        records.map(async record => ({
          id: record.id,
          displayName: record.displayName,
          family: record.family,
          file: record.file
            ? await core.storage.getReference(record.file)
            : null,
          weight: record.weight,
          created: record.created,
          updated: record.updated
        }))
      )
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
      OK: fontUploadSchema
    }
  })
  .callback(async ({ db, core, query: { id }, response }) => {
    const record = await db.query.fontsFontFamilyUpload.findFirst({
      where: { id }
    })

    if (!record) {
      return response.notFound()
    }

    return response.ok({
      id: record.id,
      displayName: record.displayName,
      family: record.family,
      file: record.file ? await core.storage.getReference(record.file) : null,
      weight: record.weight,
      created: record.created,
      updated: record.updated
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
      OK: fontUploadSchema
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

      if (!isValidFontFile(file.originalName)) {
        return response.badRequest(
          'Invalid file type. Only TTF, OTF, WOFF, and WOFF2 files are allowed.'
        )
      }

      let existingFileKey: string | undefined

      if (id) {
        const existing = await db.query.fontsFontFamilyUpload.findFirst({
          where: { id }
        })

        if (!existing) {
          return response.notFound()
        }
        existingFileKey = existing.file
      }

      const fileKey = await core.storage.save({
        file,
        currentKey: existingFileKey
      })

      if (!fileKey) {
        return response.badRequest('Failed to save font file')
      }

      if (id) {
        const [updated] = await db
          .update(fontsFontFamilyUpload)
          .set({
            displayName,
            family,
            weight,
            file: fileKey.key,
            updated: new Date()
          })
          .where(eq(fontsFontFamilyUpload.id, id))
          .returning()

        if (!updated) {
          return response.notFound()
        }

        return response.ok({
          id: updated.id,
          displayName: updated.displayName,
          family: updated.family,
          file: fileKey,
          weight: updated.weight,
          created: updated.created,
          updated: updated.updated
        })
      }

      const [created] = await db
        .insert(fontsFontFamilyUpload)
        .values({
          displayName,
          family,
          weight,
          file: fileKey.key
        })
        .returning()

      if (!created) {
        return response.badRequest('Failed to create font')
      }

      return response.ok({
        id: created.id,
        displayName: created.displayName,
        family: created.family,
        file: fileKey,
        weight: created.weight,
        created: created.created,
        updated: created.updated
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
      NO_CONTENT: true
    }
  })
  .callback(async ({ db, core, query: { id }, response }) => {
    const record = await db.query.fontsFontFamilyUpload.findFirst({
      where: { id }
    })

    if (!record) {
      return response.notFound()
    }

    if (record.file) {
      await core.storage.delete(record.file)
    }

    await db
      .delete(fontsFontFamilyUpload)
      .where(eq(fontsFontFamilyUpload.id, id))

    return response.noContent()
  })
