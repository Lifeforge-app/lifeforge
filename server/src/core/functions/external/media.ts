import fs from 'fs'

type FileResult<TFieldName extends string> =
  | {}
  | { [K in TFieldName]: File | File[] | null | undefined }

export default async function getMedia<TFieldName extends string = string>(
  fieldName: TFieldName,
  media: string | Express.Multer.File | Express.Multer.File[] | undefined
): Promise<FileResult<TFieldName>> {
  if (media === 'keep') {
    return {}
  }

  // If the media is removed, return null for the field
  if (media === 'removed') {
    return { [fieldName]: null }
  }

  // If the media is a string (URL), fetch it and return as a File
  if (typeof media === 'string') {
    const response = await fetch(media)

    const fileBuffer = await response.arrayBuffer()

    return {
      [fieldName]: new File(
        [fileBuffer],
        `${fieldName}.${media.split('.').pop()}`
      )
    }
  }

  if (media) {
    // If the media is multiple files, return an array of Filee
    if (Array.isArray(media)) {
      return {
        [fieldName]: media.map(file => {
          return new File([fs.readFileSync(file.path)], file.originalname)
        })
      }
    }

    // If the media is a single file, return it as a File
    return {
      [fieldName]: new File([fs.readFileSync(media.path)], media.originalname)
    }
  }

  // If no media is provided, return null for the field
  return { [fieldName]: null }
}
