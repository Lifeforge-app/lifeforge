import chalk from 'chalk'
import ora from 'ora'
import prompts from 'prompts'
import cancelOperation from './functions/cancelOperation'
import confirmDeletionStep from './functions/confirmDeletionStep'
import confirmModuleName from './functions/confirmModuleName'
import printDisclaimer from './functions/printDisclaimer'
import requestOTP from './functions/requestOTP'
import selectModule from './functions/selectModule'
import validateOTPCode from './functions/validateOTPCode'

async function deleteModule(
  login: any,
  t: (key: string) => string
): Promise<void> {
  printDisclaimer(t)
  console.log()
  await confirmDeletionStep(t)

  const module = await selectModule(t)
  await confirmModuleName(t, module)

  const OTPId = await requestOTP(t, login)
  await validateOTPCode(t, login, OTPId)

  await confirmDeletionStep(t)
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

export default deleteModule
