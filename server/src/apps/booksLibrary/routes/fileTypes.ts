import { forgeController, forgeRouter } from '@functions/routes'

const getAllFileTypes = forgeController.query
  .description('Get all file types for the books library')
  .input({})
  .callback(({ pb }) =>
    pb.getFullList
      .collection('books_library__file_types_aggregated')
      .sort(['name'])
      .execute()
  )

export default forgeRouter({ getAllFileTypes })
