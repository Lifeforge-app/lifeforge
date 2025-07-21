import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'
import { getAPIKey } from '@functions/getAPIKey'

import { AiControllersSchemas } from 'shared/types/controllers'

import * as ImageGenerationService from '../services/imageGeneration.service'

const checkKey = forgeController
  .route('GET /key-exists')
  .description('Check if OpenAI API key exists')
  .schema(AiControllersSchemas.ImageGeneration.checkKey)
  .callback(async ({ pb }) => !!(await getAPIKey('openai', pb)))

const generateImage = forgeController
  .route('POST /generate-image')
  .description('Generate an image from a text prompt')
  .schema(AiControllersSchemas.ImageGeneration.generateImage)
  .callback(async ({ pb, body: { prompt } }) =>
    ImageGenerationService.generateImage(pb, prompt)
  )

export default forgeRouter({ checkKey, generateImage })
