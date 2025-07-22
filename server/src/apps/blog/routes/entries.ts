import { forgeController } from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'

import { BlogCollectionsSchemas, ISchemaWithPB } from 'shared/types/collections'

const getAllEntries = forgeController
  .route('GET /')
  .description('Get all blog entries')
  .input({})
  .callback(({ pb }) =>
    pb
      .collection('blog__entries')
      .getFullList<ISchemaWithPB<BlogCollectionsSchemas.IEntry>>()
  )

export default forgeRouter({ getAllEntries })
