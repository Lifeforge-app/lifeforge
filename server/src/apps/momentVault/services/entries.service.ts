import { WithPB } from '@typescript/pocketbase_interfaces'
import fs from 'fs'
import { ListResult } from 'pocketbase'
import Client from 'pocketbase'

import { MomentVaultCollectionsSchemas } from 'shared/types/collections'

import { convertToMp3 } from '../utils/convertToMP3'

export async function getEntryById(
  pb: Client,
  id: string
): Promise<MomentVaultCollectionsSchemas.IEntry> {
  return await pb
    .collection('moment_vault__entries')
    .getOne<MomentVaultCollectionsSchemas.IEntry>(id)
}

export const getAllEntries = async (
  pb: Client,
  page: number = 1
): Promise<ListResult<WithPB<MomentVaultCollectionsSchemas.IEntry>>> => {
  const entries = await pb
    .collection('moment_vault__entries')
    .getList<WithPB<MomentVaultCollectionsSchemas.IEntry>>(page, 10, {
      sort: '-created'
    })

  entries.items.forEach(entry => {
    if (entry.file) {
      entry.file = entry.file.map(
        file => pb.files.getURL(entry, file).split('/files/')[1]
      )
    }
  })

  return entries
}

export const createAudioEntry = async (
  pb: Client,
  {
    file,
    transcription
  }: {
    file: Express.Multer.File
    transcription?: string
  }
): Promise<WithPB<MomentVaultCollectionsSchemas.IEntry>> => {
  if (file.mimetype !== 'audio/mp3') {
    file.path = await convertToMp3(file.path)
  }

  const fileBuffer = fs.readFileSync(file.path)

  const entry = await pb
    .collection('moment_vault__entries')
    .create<WithPB<MomentVaultCollectionsSchemas.IEntry>>({
      type: 'audio',
      file: new File([fileBuffer], file.path.split('/').pop() || 'audio.mp3'),
      transcription
    })

  if (entry.file) {
    entry.file = entry.file.map(
      file => pb.files.getURL(entry, file).split('/files/')[1]
    )
  }

  fs.unlinkSync(file.path)

  return entry
}

export const createTextEntry = async (
  pb: Client,
  content: string
): Promise<WithPB<MomentVaultCollectionsSchemas.IEntry>> => {
  return await pb
    .collection('moment_vault__entries')
    .create<WithPB<MomentVaultCollectionsSchemas.IEntry>>({
      type: 'text',
      content
    })
}

export const createPhotosEntry = async (
  pb: Client,
  files: Express.Multer.File[]
): Promise<WithPB<MomentVaultCollectionsSchemas.IEntry>> => {
  const allImages = files.map(file => {
    const fileBuffer = fs.readFileSync(file.path)

    return new File([fileBuffer], file.path.split('/').pop() || 'photo.jpg')
  })

  const entry = await pb
    .collection('moment_vault__entries')
    .create<WithPB<MomentVaultCollectionsSchemas.IEntry>>({
      type: 'photos',
      file: allImages
    })

  if (entry.file) {
    entry.file = (entry.file as string[]).map(
      file => pb.files.getURL(entry, file).split('/files/')[1]
    )
  }

  files.forEach(file => {
    fs.unlinkSync(file.path)
  })

  return entry
}

export const updateEntry = async (
  pb: Client,
  id: string,
  content: string
): Promise<WithPB<MomentVaultCollectionsSchemas.IEntry>> =>
  await pb
    .collection('moment_vault__entries')
    .update<WithPB<MomentVaultCollectionsSchemas.IEntry>>(id, {
      content
    })

export async function deleteEntry(pb: Client, id: string): Promise<void> {
  await pb.collection('moment_vault__entries').delete(id)
}
