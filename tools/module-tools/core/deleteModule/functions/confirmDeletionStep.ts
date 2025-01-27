import chalk from 'chalk'
import prompts from 'prompts'
import cancelOperation from './cancelOperation'

async function confirmDeletionStep(t: (key: string) => string): Promise<void> {
  const confirm = await prompts({
    type: 'confirm',
    name: 'value',
    message: t('moduleTools.features.delete.prompts.proceedConfirmation')
  })

  if (confirm.value !== true) {
    cancelOperation(t)
  }

  const confirmAgain = await prompts({
    type: 'text',
    name: 'value',
    message: t(
      'moduleTools.features.delete.prompts.proceedConfirmation2'
    ).replace('{}', chalk.yellow('I know what I am doing'))
  })

  if (confirmAgain.value !== 'I know what I am doing') {
    cancelOperation(t)
  }
}

export default confirmDeletionStep
