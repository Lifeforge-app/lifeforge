import { forgeController } from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'

const getAllEntries = forgeController
  .route('GET /')
  .description('Get all blog entries')
  .input({})
  .callback(({ pb }) => pb.getFullList.collection('blog__entries').execute())

export default forgeRouter({ getAllEntries })
