import { forgeController, forgeRouter } from '@functions/routes'

const getAllEntries = forgeController
  .route('GET /')
  .description('Get all blog entries')
  .input({})
  .callback(({ pb }) => pb.getFullList.collection('blog__entries').execute())

export default forgeRouter({ getAllEntries })
