import { forgeRouter } from '@functions/routes'

import forgeAgentRouter from './routes/forgeAgent'
import imageGenerationRouter from './routes/imageGeneration'

export default forgeRouter({
  imageGeneration: imageGenerationRouter,
  forgeAgent: forgeAgentRouter
})
