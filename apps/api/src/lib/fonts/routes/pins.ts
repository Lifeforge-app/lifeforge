import { getPB } from '@lib/auth/constants/pb'
import z from 'zod'

import forge from '../forge'

export const list = forge
  .query({
    description: 'Retrieve pinned Google Fonts',
    input: {},
    output: {
      OK: z.array(z.string()),
      UNAUTHORIZED: true
    }
  })
  .callback(async ({ response }) => {
    const pb = await getPB('user')

    const user = await pb.getFirstListItem
      .collection('users')
      .execute()
      .catch(() => null)

    if (!user) {
      return response.unauthorized()
    }

    return response.ok((user.pinnedFontFamilies || []) as string[])
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
      NO_CONTENT: true,
      UNAUTHORIZED: true
    }
  })
  .callback(async ({ body: { family }, response }) => {
    const pb = await getPB('user')

    const user = await pb.getFirstListItem
      .collection('users')
      .execute()
      .catch(() => null)

    if (!user) {
      return response.unauthorized()
    }

    const pinnedFontFamilies: string[] = user.pinnedFontFamilies || []

    const updatedPinnedFontFamilies = pinnedFontFamilies.includes(family)
      ? pinnedFontFamilies.filter(f => f !== family)
      : [...pinnedFontFamilies, family]

    await pb.update
      .collection('users')
      .id(user.id)
      .data({
        pinnedFontFamilies: updatedPinnedFontFamilies
      })
      .execute()

    return response.noContent()
  })
