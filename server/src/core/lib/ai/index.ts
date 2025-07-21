import forgeRouter from '@functions/forgeRouter'

import imageGenerationRouter from './controllers/imageGeneration'

export default forgeRouter({
  '/image-generation': imageGenerationRouter
})
