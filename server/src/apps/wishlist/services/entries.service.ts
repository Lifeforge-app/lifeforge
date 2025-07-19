import PocketBase from 'pocketbase'

import { ISchemaWithPB } from 'shared/types/collections'
import { WishlistCollectionsSchemas } from 'shared/types/collections'

import scrapeProviders from '../helpers/scrapers/index'

export const getCollectionId = (pb: PocketBase): string =>
  pb.collection('wishlist__entries').collectionIdOrName

export const getEntriesByListId = (
  pb: PocketBase,
  listId: string,
  bought?: boolean
): Promise<ISchemaWithPB<WishlistCollectionsSchemas.IEntry>[]> =>
  pb
    .collection('wishlist__entries')
    .getFullList<ISchemaWithPB<WishlistCollectionsSchemas.IEntry>>({
      filter: `list = "${listId}" ${
        typeof bought !== 'undefined' ? `&& bought = ${bought}` : ''
      }`
    })

export const scrapeExternal = async (
  pb: PocketBase,
  provider: string,
  url: string
): Promise<{
  name: string
  price: number
  image?: string
}> => {
  const result = await scrapeProviders[
    provider as keyof typeof scrapeProviders
  ]?.(pb, url)

  if (!result) {
    throw new Error('Error scraping provider')
  }

  return result
}

export const createEntry = async (
  pb: PocketBase,
  data: Omit<WishlistCollectionsSchemas.IEntry, 'image' | 'bought_at'> & {
    image?: File
  }
): Promise<ISchemaWithPB<WishlistCollectionsSchemas.IEntry>> => {
  const entry = await pb
    .collection('wishlist__entries')
    .create<ISchemaWithPB<WishlistCollectionsSchemas.IEntry>>(data)

  return entry
}

export const updateEntry = async (
  pb: PocketBase,
  id: string,
  data: {
    list: string
    name: string
    url: string
    price: number
    image?: File | null
  }
): Promise<ISchemaWithPB<WishlistCollectionsSchemas.IEntry>> => {
  const entry = await pb
    .collection('wishlist__entries')
    .update<ISchemaWithPB<WishlistCollectionsSchemas.IEntry>>(id, data)

  return entry
}

export const getEntry = async (
  pb: PocketBase,
  id: string
): Promise<ISchemaWithPB<WishlistCollectionsSchemas.IEntry>> => {
  return await pb
    .collection('wishlist__entries')
    .getOne<ISchemaWithPB<WishlistCollectionsSchemas.IEntry>>(id)
}

export const updateEntryBoughtStatus = async (
  pb: PocketBase,
  id: string
): Promise<ISchemaWithPB<WishlistCollectionsSchemas.IEntry>> => {
  const oldEntry = await pb
    .collection('wishlist__entries')
    .getOne<ISchemaWithPB<WishlistCollectionsSchemas.IEntry>>(id)

  const entry = await pb
    .collection('wishlist__entries')
    .update<ISchemaWithPB<WishlistCollectionsSchemas.IEntry>>(id, {
      bought: !oldEntry.bought,
      bought_at: oldEntry.bought ? null : new Date().toISOString()
    })

  return entry
}

export const deleteEntry = async (
  pb: PocketBase,
  id: string
): Promise<void> => {
  await pb.collection('wishlist__entries').delete(id)
}
