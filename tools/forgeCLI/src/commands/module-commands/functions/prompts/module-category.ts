import prompts from 'prompts'

import CLILoggingService from '@/utils/logging'

export async function promptModuleCategory(): Promise<string> {
  const response = await prompts(
    {
      type: 'text',
      name: 'moduleCategory',
      message:
        'Enter the category for the module (e.g., Lifestyle, Productivity, Utilities):',
      validate: value => {
        if (!value || value.trim() === '') {
          return 'Module category cannot be empty'
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

  return response.moduleCategory.trim()
}
