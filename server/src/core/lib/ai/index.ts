import { forgeRouter } from '@functions/routes'

import { createForgeAgentRouter } from './routes/forgeAgent'
import imageGenerationRouter from './routes/imageGeneration'

// Factory function to create AI router with routes dependency injection
export const createAIRouter = (appRoutes: Record<string, unknown>) =>
  forgeRouter({
    imageGeneration: imageGenerationRouter,
    forgeAgent: createForgeAgentRouter(appRoutes)
  })
