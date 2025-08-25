import { forgeController, forgeRouter } from '@functions/routes'

const list = forgeController.query
  .description('Get all read status for the books library')
  .input({})
  .callback(({ pb }) =>
    pb.getFullList.collection('books_library__read_status_aggregated').execute()
  )

export default forgeRouter({ list })
