import { forgeRouter } from '@functions/routes'

import imageGenerationRouter from './routes/imageGeneration'

export default forgeRouter({
  imageGeneration: imageGenerationRouter
})
