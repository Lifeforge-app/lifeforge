import z from 'zod'

const thumbnailInfoSchema = z.object({
  size: z.string(),
  key: z.string(),
  width: z.number(),
  height: z.number()
})

export const fileReferenceSchema = z.object({
  key: z.string(),
  originalName: z.string(),
  mimeType: z.string(),
  size: z.number(),
  thumbs: z.array(thumbnailInfoSchema)
})

export type ThumbnailInfo = z.infer<typeof thumbnailInfoSchema>

/** Result of saving a file. Persisted in the `files` metadata table. */
export type FileReference = z.infer<typeof fileReferenceSchema>
