import { forgeRouter } from '@functions/routes'

import imageGenerationRouter from './routes/imageGeneration'

// Factory function to create AI router with routes dependency injection
export default forgeRouter({
  imageGeneration: imageGenerationRouter
})
