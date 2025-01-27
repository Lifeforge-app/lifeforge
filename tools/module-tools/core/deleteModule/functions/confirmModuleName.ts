import chalk from 'chalk'
import prompts from 'prompts'
import cancelOperation from './cancelOperation'

async function confirmModuleName(
  t: (key: string) => string,
  module: string
): Promise<void> {
  const confirmFinal = await prompts({
    type: 'confirm',
    name: 'value',
    message: t(
      'moduleTools.features.delete.prompts.proceedConfirmation3'
    ).replace('{}', chalk.bold.blue(module))
  })

  if (confirmFinal.value !== true) {
    cancelOperation(t)
  }

  const confirmSekaliLagi = await prompts({
    type: 'text',
    name: 'value',
    message: t(
      'moduleTools.features.delete.prompts.proceedConfirmation4'
    ).replace('{}', chalk.yellow(module))
  })

  if (confirmSekaliLagi.value !== module) {
    cancelOperation(t)
  }
}

export default confirmModuleName
