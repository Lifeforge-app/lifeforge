import chalk from 'chalk'
import fs from 'fs'
import prompts from 'prompts'

import CLILoggingService from '@/utils/logging'

import { AVAILABLE_TEMPLATE_MODULE_TYPES } from '../../../../constants/constants'

export async function promptModuleType(): Promise<
  keyof typeof AVAILABLE_TEMPLATE_MODULE_TYPES
> {
  const response = await prompts(
    {
      type: 'select',
      name: 'moduleType',
      message: 'Select the type of module to create:',
      choices: Object.entries(AVAILABLE_TEMPLATE_MODULE_TYPES).map(
        ([value, title]) => ({
          title: `${title} ${chalk.dim(`(${value})`)}`,
          value
        })
      )
    },
    {
      onCancel: () => {
        CLILoggingService.error('Module creation cancelled by user.')
        process.exit(0)
      }
    }
  )

  return response.moduleType
}

export function checkModuleTypeAvailability(
  moduleType: keyof typeof AVAILABLE_TEMPLATE_MODULE_TYPES
): void {
  const templateDir = `${process.cwd()}/tools/forgeCLI/src/templates/${moduleType}`

  if (!fs.existsSync(templateDir)) {
    CLILoggingService.error(
      `Template for module type "${moduleType}" does not exist at path: ${templateDir}`
    )
    process.exit(1)
  }

  CLILoggingService.debug(
    `Template for module type "${moduleType}" found at path: ${templateDir}`
  )

  const files = fs.readdirSync(templateDir)

  if (files.length === 0) {
    CLILoggingService.error(
      `Template directory for module type "${moduleType}" is empty at path: ${templateDir}`
    )
    process.exit(1)
  }

  CLILoggingService.debug(
    `Template for module type "${moduleType}" is available and ready to use.`
  )
}
