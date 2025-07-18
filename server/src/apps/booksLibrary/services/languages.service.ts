import { WithPB } from '@typescript/pocketbase_interfaces'
import PocketBase from 'pocketbase'

import { BooksLibraryCollectionsSchemas } from 'shared/types/collections'

export const getAllLanguages = (
  pb: PocketBase
): Promise<WithPB<BooksLibraryCollectionsSchemas.ILanguage>[]> =>
  pb
    .collection('books_library__languages_aggregated')
    .getFullList<WithPB<BooksLibraryCollectionsSchemas.ILanguage>>()

export const createLanguage = (
  pb: PocketBase,
  languageData: { name: string; icon: string }
): Promise<WithPB<BooksLibraryCollectionsSchemas.ILanguage>> =>
  pb
    .collection('books_library__languages')
    .create<WithPB<BooksLibraryCollectionsSchemas.ILanguage>>(languageData)

export const updateLanguage = (
  pb: PocketBase,
  id: string,
  languageData: { name: string; icon: string }
): Promise<WithPB<BooksLibraryCollectionsSchemas.ILanguage>> =>
  pb
    .collection('books_library__languages')
    .update<WithPB<BooksLibraryCollectionsSchemas.ILanguage>>(id, languageData)

export const deleteLanguage = async (pb: PocketBase, id: string) => {
  await pb.collection('books_library__languages').delete(id)
}
