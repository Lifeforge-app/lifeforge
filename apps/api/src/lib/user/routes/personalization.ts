import { eq } from 'drizzle-orm'
import z from 'zod'

import forge from '../forge'
import { users } from '../schema.drizzle'

export const updateBgImage = forge
  .mutation({
    description: 'Upload new background image',
    input: {},
    media: {
      file: {
        optional: false
      }
    },
    output: {
      OK: z.object({
        key: z.string()
      }),
      BAD_REQUEST: z.string(),
      UNAUTHORIZED: true
    }
  })
  .callback(async ({ db, media: { file }, core, response }) => {
    if (typeof file === 'string') {
      return response.badRequest('A valid background image must be uploaded')
    }

    const user = await db.query.users.findFirst()

    if (!user) {
      return response.unauthorized()
    }

    const bgImageKey = await core.storage.save({
      file,
      currentKey: user.bgImage || undefined,
      table: 'users',
      field: 'bgImage'
    })

    if (!bgImageKey) {
      return response.badRequest('Failed to save background image')
    }

    await db
      .update(users)
      .set({
        bgImage: bgImageKey,
        backdropFilters: {
          brightness: 100,
          blur: 'none',
          contrast: 100,
          saturation: 100,
          overlayOpacity: 50
        },
        updated: new Date()
      })
      .where(eq(users.id, user.id))

    return response.ok({
      key: bgImageKey
    })
  })

export const deleteBgImage = forge
  .mutation({
    description: 'Remove background image',
    input: {},
    output: {
      NO_CONTENT: true,
      UNAUTHORIZED: true
    }
  })
  .callback(async ({ db, core, response }) => {
    const user = await db.query.users.findFirst()

    if (!user) {
      return response.unauthorized()
    }

    if (user.bgImage) {
      await core.storage.delete(user.bgImage)
    }

    await db
      .update(users)
      .set({
        bgImage: null,
        updated: new Date()
      })
      .where(eq(users.id, user.id))

    return response.noContent()
  })

export const updatePersonalization = forge
  .mutation({
    description: 'Update user personalization preferences',
    input: {
      body: z.object({
        data: z.object({
          fontFamily: z.string().optional(),
          theme: z.string().optional(),
          color: z.string().optional(),
          bgTemp: z.string().optional(),
          language: z.string().optional(),
          fontScale: z.number().optional(),
          borderRadiusMultiplier: z.number().optional(),
          bordered: z.boolean().optional(),
          dashboardLayout: z.record(z.string(), z.any()).optional(),
          backdropFilters: z.record(z.string(), z.any()).optional()
        })
      })
    },
    output: {
      NO_CONTENT: true,
      BAD_REQUEST: z.string(),
      UNAUTHORIZED: true
    }
  })
  .callback(async ({ db, body: { data }, response }) => {
    const user = await db.query.users.findFirst()

    if (!user) {
      return response.unauthorized()
    }

    const toBeUpdated: Record<string, unknown> = {}

    for (const item of [
      'fontFamily',
      'theme',
      'color',
      'bgTemp',
      'language',
      'fontScale',
      'borderRadiusMultiplier',
      'bordered',
      'dashboardLayout',
      'backdropFilters'
    ]) {
      if (data[item as keyof typeof data] !== undefined) {
        toBeUpdated[item] = data[item as keyof typeof data]
      }
    }

    if (!Object.keys(toBeUpdated).length) {
      return response.badRequest('No data to update')
    }

    toBeUpdated.updated = new Date()

    await db.update(users).set(toBeUpdated).where(eq(users.id, user.id))

    return response.noContent()
  })
