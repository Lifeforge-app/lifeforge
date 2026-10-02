import { create as createContentDisposition } from 'content-disposition'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { generateThumbKey } from '@lifeforge/file-storage'
import { files } from '@lifeforge/file-storage/server'
import { forgeRouter } from '@lifeforge/server-utils'

import { storageProvider } from '@/core/storage'

import forge from './forge'

const get = forge
  .query({
    description: 'Retrieve a stored file or thumbnail',
    encrypted: false,
    rateLimit: false,
    noAuth: true,
    input: {
      query: z.object({
        key: z.string(),
        thumb: z.string().optional(),
        download: z.string().optional()
      })
    },
    output: 'custom'
  })
  .callback(async ({ db, query: { key, thumb, download }, res }) => {
    const [row] = await db
      .select()
      .from(files)
      .where(eq(files.key, key))
      .limit(1)

    if (!row) {
      res.status(404).json({ error: 'File not found' })

      return
    }

    const targetKey = thumb ? generateThumbKey(key, thumb) : key
    const fileStream = await storageProvider.get(targetKey)

    if (!fileStream) {
      res.status(404).json({ error: 'File not found' })

      return
    }

    res.setHeader('Content-Type', row.mimeType)

    if (fileStream.size > 0) {
      res.setHeader('Content-Length', fileStream.size)
    }

    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.setHeader(
      'Content-Disposition',
      createContentDisposition(row.originalName, {
        type: download === 'true' ? 'attachment' : 'inline'
      })
    )

    fileStream.stream.pipe(res)
  })

export default forgeRouter({
  get
})
