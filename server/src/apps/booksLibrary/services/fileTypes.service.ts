import { WithPB } from '@typescript/pocketbase_interfaces'
import PocketBase from 'pocketbase'

import { BooksLibraryCollectionsSchemas } from 'shared/types/collections'

export const getAllFileTypes = (
  pb: PocketBase
): Promise<WithPB<BooksLibraryCollectionsSchemas.IFileTypeAggregated>[]> =>
  pb
    .collection('books_library__file_types_aggregated')
    .getFullList<WithPB<BooksLibraryCollectionsSchemas.IFileTypeAggregated>>({
      sort: 'name'
    })
