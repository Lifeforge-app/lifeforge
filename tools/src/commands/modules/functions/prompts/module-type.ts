import fs from 'fs'
import prompts from 'prompts'

import { ROOT_DIR } from '@/constants/constants'
import logger from '@/utils/logger'

import { AVAILABLE_TEMPLATE_MODULE_TYPES } from '../../handlers/createModuleHandler'
import chalk from 'chalk'

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
        logger.error('Module creation cancelled by user.')
        process.exit(0)
      }
    }
  )

  return response.moduleType
}

export function checkModuleTypeAvailability(
  moduleType: keyof typeof AVAILABLE_TEMPLATE_MODULE_TYPES
): void {
  const templateDir = `${ROOT_DIR}/tools/src/templates/${moduleType}`

  if (!fs.existsSync(templateDir)) {
    logger.error(
      `Template for module type "${moduleType}" does not exist at path: ${templateDir}`
    )
    process.exit(1)
  }

  logger.debug(
    `Template for module type "${moduleType}" found at path: ${templateDir}`
  )

  const files = fs.readdirSync(templateDir)

  if (files.length === 0) {
    logger.error(
      `Template directory for module type "${moduleType}" is empty at path: ${templateDir}`
    )
    process.exit(1)
  }

  logger.debug(
    `Template for module type "${moduleType}" is available and ready to use.`
  )
}
