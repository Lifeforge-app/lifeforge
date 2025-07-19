import PocketBase from 'pocketbase'

import { ISchemaWithPB } from 'shared/types/collections'
import { BooksLibraryCollectionsSchemas } from 'shared/types/collections'

export const getAllFileTypes = (
  pb: PocketBase
): Promise<
  ISchemaWithPB<BooksLibraryCollectionsSchemas.IFileTypeAggregated>[]
> =>
  pb
    .collection('books_library__file_types_aggregated')
    .getFullList<
      ISchemaWithPB<BooksLibraryCollectionsSchemas.IFileTypeAggregated>
    >({
      sort: 'name'
    })
