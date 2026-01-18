import { forgeRouter } from '@lifeforge/server-utils'

import * as imageGenerationRoutes from './routes/imageGeneration'

export default forgeRouter({
  imageGeneration: imageGenerationRoutes
})
