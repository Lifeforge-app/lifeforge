import prompts from 'prompts'

import { CLILoggingService } from '../../../utils/logging'

async function promptForModuleName(): Promise<string> {
  const response = await prompts({
    type: 'text',
    name: 'moduleName',
    message: 'Enter the name of the module to create:',
    validate: value =>
      value.trim() === '' ? 'Module name cannot be empty' : true
  })

  return response.moduleName.trim()
}

/**
 * Handles the create module command
 */
export async function createModuleHandler(moduleName?: string): Promise<void> {
  if (!moduleName) {
    moduleName = await promptForModuleName()
  }

  // Further implementation for creating the module goes here
  CLILoggingService.error('Create module functionality is not yet implemented.')
}
