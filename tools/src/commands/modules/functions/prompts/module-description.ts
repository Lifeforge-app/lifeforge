import _ from 'lodash'
import prompts from 'prompts'
import z from 'zod'

import { fetchAI } from '@/utils/ai'
import logger from '@/utils/logger'

export async function promptModuleDescription(): Promise<{
  en: string
  ms: string
  zhCN: string
  zhTW: string
}> {
  const response = await prompts(
    {
      type: 'text',
      name: 'moduleDescription',
      message: 'Enter a brief description for the module:',
      validate: value => {
        if (!value || value.trim() === '') {
          return 'Module description cannot be empty'
        }

        return true
      }
    },
    {
      onCancel: () => {
        logger.error('Module creation cancelled by user.')
        process.exit(0)
      }
    }
  )

  const translationResponse = await fetchAI({
    messages: [
      {
        role: 'system',
        content:
          'You are an expert translator that translates descriptions into concise and clear languages. Given a description, translate it into Malay, Chinese (Simplified), and Chinese (Traditional). Translate only the description without adding any additional text.'
      },
      {
        role: 'user',
        content: `Translate the following module description into Malay, Chinese (Simplified), and Chinese (Traditional): "${response.moduleDescription.trim()}"`
      }
    ],
    model: 'gpt-4o-mini',
    structure: z.object({
      ms: z.string().min(1),
      zhCN: z.string().min(1),
      zhTW: z.string().min(1)
    })
  })

  if (!translationResponse) {
    logger.warn(
      "Failed to translate description. Please edit it manually in the module's localization files."
    )

    return {
      en: response.moduleDescription.trim(),
      ms: response.moduleDescription.trim(),
      zhCN: response.moduleDescription.trim(),
      zhTW: response.moduleDescription.trim()
    }
  }

  for (const [key, value] of Object.entries(translationResponse)) {
    logger.debug(`Translated module description [${key}]: ${value}`)
  }

  return {
    en: _.upperFirst(response.moduleDescription.trim()),
    ...translationResponse
  }
}
