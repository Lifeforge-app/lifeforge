import PocketBase from 'pocketbase'

import { ISchemaWithPB } from 'shared/types/collections'
import { BooksLibraryCollectionsSchemas } from 'shared/types/collections'

export const getAllLanguages = (
  pb: PocketBase
): Promise<
  ISchemaWithPB<BooksLibraryCollectionsSchemas.ILanguageAggregated>[]
> =>
  pb
    .collection('books_library__languages_aggregated')
    .getFullList<
      ISchemaWithPB<BooksLibraryCollectionsSchemas.ILanguageAggregated>
    >()

export const createLanguage = (
  pb: PocketBase,
  languageData: { name: string; icon: string }
): Promise<ISchemaWithPB<BooksLibraryCollectionsSchemas.ILanguage>> =>
  pb
    .collection('books_library__languages')
    .create<
      ISchemaWithPB<BooksLibraryCollectionsSchemas.ILanguage>
    >(languageData)

export const updateLanguage = (
  pb: PocketBase,
  id: string,
  languageData: { name: string; icon: string }
): Promise<ISchemaWithPB<BooksLibraryCollectionsSchemas.ILanguage>> =>
  pb
    .collection('books_library__languages')
    .update<
      ISchemaWithPB<BooksLibraryCollectionsSchemas.ILanguage>
    >(id, languageData)

export const deleteLanguage = async (pb: PocketBase, id: string) => {
  await pb.collection('books_library__languages').delete(id)
}
