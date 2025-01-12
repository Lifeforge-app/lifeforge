import confirmDeletionStep from './functions/confirmDeletionStep'
import confirmModuleName from './functions/confirmModuleName'
import deleteModuleFunc from './functions/deleteModuleFunc'
import finalConfirmation from './functions/finalConfirmation'
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
  await finalConfirmation(t)

  await deleteModuleFunc(module)
}

export default deleteModule
