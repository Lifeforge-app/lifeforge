import { forgeController } from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'

import { BlogControllersSchemas } from 'shared/types/controllers'

const getAllEntries = forgeController
  .route('GET /')
  .description('Get all blog entries')
  .schema(BlogControllersSchemas.Entries.getAllEntries)
  .callback(({ pb }) => pb.collection('blog__entries').getFullList())

export default forgeRouter({ getAllEntries })
