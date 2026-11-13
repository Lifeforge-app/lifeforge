import { eq } from 'drizzle-orm'
import z from 'zod'

import forge from '../forge'
import { fontsPinnedFonts } from '../schema.drizzle'

export const list = forge
  .query({
    description: 'Retrieve pinned Google Fonts',
    input: {},
    output: {
      OK: z.array(z.string())
    }
  })
  .callback(async ({ db, response }) => {
    const pins = await db.query.fontsPinnedFonts.findMany({
      orderBy: { created: 'asc' }
    })

    return response.ok(pins.map(pin => pin.family))
  })

export const toggle = forge
  .mutation({
    description: 'Pin or unpin a Google Font',
    input: {
      body: z.object({
        family: z.string()
      })
    },
    output: {
      NO_CONTENT: true
    }
  })
  .callback(async ({ db, body: { family }, response }) => {
    const deleted = await db
      .delete(fontsPinnedFonts)
      .where(eq(fontsPinnedFonts.family, family))
      .returning()

    if (deleted.length === 0) {
      await db.insert(fontsPinnedFonts).values({ family }).onConflictDoNothing()
    }

    return response.noContent()
  })
