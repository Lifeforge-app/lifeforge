import { WithPB } from '@typescript/pocketbase_interfaces'
import PocketBase from 'pocketbase'

import { BooksLibraryCollectionsSchemas } from 'shared/types/collections'

export const getAllCollections = (pb: PocketBase) =>
  pb
    .collection('books_library__collections_aggregated')
    .getFullList<WithPB<BooksLibraryCollectionsSchemas.ICollectionAggregated>>({
      sort: 'name'
    })

export const createCollection = async (
  pb: PocketBase,
  data: Omit<BooksLibraryCollectionsSchemas.ICollection, 'amount'>
) => {
  const collection = await pb
    .collection('books_library__collections')
    .create<WithPB<BooksLibraryCollectionsSchemas.ICollection>>(data)

  return pb
    .collection('books_library__collections_aggregated')
    .getOne<
      WithPB<BooksLibraryCollectionsSchemas.ICollectionAggregated>
    >(collection.id)
}

export const updateCollection = async (
  pb: PocketBase,
  id: string,
  data: Omit<BooksLibraryCollectionsSchemas.ICollectionAggregated, 'amount'>
) => {
  const collection = await pb
    .collection('books_library__collections')
    .update<WithPB<BooksLibraryCollectionsSchemas.ICollection>>(id, data)

  return pb
    .collection('books_library__collections_aggregated')
    .getOne<
      WithPB<BooksLibraryCollectionsSchemas.ICollectionAggregated>
    >(collection.id)
}

export const deleteCollection = async (pb: PocketBase, id: string) => {
  await pb.collection('books_library__collections').delete(id)
}
