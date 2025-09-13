import { forgeController, forgeRouter } from '@functions/routes'

const list = forgeController
  .query()
  .description('Get all blog entries')
  .input({})
  .callback(({ pb }) => pb.getFullList.collection('blog__entries').execute())

export default forgeRouter({ list })
