import prompts from 'prompts'
import z from 'zod'

import { fetchAI } from '@/utils/ai'
import CLILoggingService from '@/utils/logging'

import { getInstalledModules } from '../../utils/file-system'

export async function promptForModuleName(moduleName?: string): Promise<{
  en: string
  ms: string
  zhCN: string
  zhTW: string
}> {
  if (!moduleName) {
    const availableModules = getInstalledModules()

    const response = await prompts(
      {
        type: 'text',
        name: 'moduleName',
        message: 'Enter the name of the module to create:',
        validate: value => {
          if (!value || value.trim() === '') {
            return 'Module name cannot be empty'
          }

          if (availableModules.includes(value.trim())) {
            return `Module "${value.trim()}" already exists. Please uninstall it, or choose a different name.`
          }

          return true
        }
      },
      {
        onCancel: () => {
          CLILoggingService.error('Module creation cancelled by user.')
          process.exit(0)
        }
      }
    )

    moduleName = response.moduleName
  }

  const translationResponse = await fetchAI({
    messages: [
      {
        role: 'system',
        content:
          'You are an expert translator that translates names into concise and clear languages. Given a name, translate it into Malay, Chinese (Simplified), and Chinese (Traditional). Translate only the name without adding any additional text.'
      },
      {
        role: 'user',
        content: `Translate the following module name into Malay, Chinese (Simplified), and Chinese (Traditional): "${moduleName!.trim()}"`
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
    CLILoggingService.warn(
      "Failed to translate module name. Please edit it manually in the module's localization files."
    )

    return {
      en: moduleName!.trim(),
      ms: moduleName!.trim(),
      zhCN: moduleName!.trim(),
      zhTW: moduleName!.trim()
    }
  }

  for (const [key, value] of Object.entries(translationResponse)) {
    CLILoggingService.debug(`Translated module name [${key}]: ${value}`)
  }

  return {
    en: moduleName!.trim(),
    ...translationResponse
  }
}
