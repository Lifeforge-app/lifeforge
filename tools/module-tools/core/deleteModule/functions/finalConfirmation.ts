import chalk from 'chalk'
import prompts from 'prompts'
import cancelOperation from './cancelOperation'

async function finalConfirmation(t: (key: string) => string): Promise<void> {
  const finalConfirmation = await prompts({
    type: 'confirm',
    name: 'value',
    message: t('moduleTools.features.delete.prompts.finalConfirmation')
      .split(':')
      .map((e, i) => (i === 0 ? chalk.red.bold(e) : e))
      .join(chalk.red.bold(':'))
  })

  if (finalConfirmation.value !== true) {
    cancelOperation(t)
  }
}

export default finalConfirmation
