import { forgeController } from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'

import {
  BooksLibraryCollectionsSchemas,
  ISchemaWithPB
} from 'shared/types/collections'

const getAllFileTypes = forgeController
  .route('GET /')
  .description('Get all file types for the books library')
  .input({})
  .callback(({ pb }) =>
    pb
      .collection('books_library__file_types_aggregated')
      .getFullList<
        ISchemaWithPB<BooksLibraryCollectionsSchemas.IFileTypeAggregated>
      >({
        sort: 'name'
      })
  )

export default forgeRouter({ getAllFileTypes })
