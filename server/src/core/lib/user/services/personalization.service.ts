import ClientError from '@functions/ClientError'
import { getAPIKey } from '@functions/getAPIKey'
import fs from 'fs'
import PocketBase from 'pocketbase'

export const listGoogleFonts = async (
  pb: PocketBase
): Promise<{ enabled: boolean; items?: any[] }> => {
  const key = await getAPIKey('gcloud', pb)

  if (!key) {
    return {
      enabled: false
    }
  }

  const target = `https://www.googleapis.com/webfonts/v1/webfonts?key=${key}`

  const response = await fetch(target)

  const data = await response.json()

  return {
    enabled: true,
    items: data.items
  }
}

export const getGoogleFont = async (
  pb: PocketBase,
  family: string
): Promise<{ enabled: boolean; items?: any[] }> => {
  const key = await getAPIKey('gcloud', pb)

  if (!key) {
    return {
      enabled: false
    }
  }

  const target = `https://www.googleapis.com/webfonts/v1/webfonts?family=${encodeURIComponent(family)}&key=${key}`

  const response = await fetch(target)

  const data = await response.json()

  return {
    enabled: true,
    items: data.items
  }
}

const updateBgImageFromFile = async (
  pb: PocketBase,
  fileBuffer: Buffer,
  originalName: string
): Promise<string> => {
  const newEntry = await pb
    .collection('users')
    .update(pb.authStore.record!.id, {
      bgImage: new File(
        [fileBuffer],
        `bgImage.${originalName.split('.').pop()}`
      )
    })

  return `media/${newEntry.collectionId}/${newEntry.id}/${newEntry.bgImage}`
}

const updateBgImageFromUrl = async (
  pb: PocketBase,
  fileBuffer: Uint8Array
): Promise<string> => {
  const newEntry = await pb
    .collection('users')
    .update(pb.authStore.record!.id, {
      bgImage: new File([fileBuffer], `bgImage.png`)
    })

  return `media/${newEntry.collectionId}/${newEntry.id}/${newEntry.bgImage}`
}

export const updateBgImage = async (
  pb: PocketBase,
  file?: Express.Multer.File,
  url?: string
): Promise<string> => {
  if (file) {
    const fileBuffer = fs.readFileSync(file.path)

    const result = await updateBgImageFromFile(
      pb,
      fileBuffer,
      file.originalname
    )

    fs.unlinkSync(file.path)
    return result
  }

  if (!url) {
    throw new ClientError('No file uploaded')
  }

  try {
    const response = await fetch(url)

    const fileBuffer = await response.arrayBuffer()

    return await updateBgImageFromUrl(pb, new Uint8Array(fileBuffer))
  } catch {
    throw new Error('Invalid file')
  }
}

export const deleteBgImage = async (
  pb: PocketBase,
  userId: string
): Promise<void> => {
  await pb.collection('users').update(userId, {
    bgImage: null
  })
}

export const updatePersonalization = async (
  pb: PocketBase,
  userId: string,
  data: { [key: string]: any }
): Promise<void> => {
  const toBeUpdated: { [key: string]: any } = {}

  for (const item of [
    'fontFamily',
    'theme',
    'color',
    'bgTemp',
    'language',
    'dashboardLayout',
    'backdropFilters'
  ]) {
    if (data[item as keyof typeof data]) {
      toBeUpdated[item] = data[item as keyof typeof data]
    }
  }

  if (!Object.keys(toBeUpdated).length) {
    throw new ClientError('No data to update')
  }

  await pb.collection('users').update(userId, data)
}
