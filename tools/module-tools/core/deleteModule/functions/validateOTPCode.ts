import chalk from 'chalk'
import ora from 'ora'
import prompts from 'prompts'
import { validateOTP } from '../../../utils/OTP'

async function validateOTPCode(
  t: (key: string) => string,
  login: any,
  OTPId: string
): Promise<void> {
  const { otp } = await prompts({
    type: 'password',
    name: 'otp',
    message: t('moduleTools.auth.prompts.OTP'),
    format: value => value.trim(),
    validate: value =>
      value !== undefined && value !== '' && /^\d{6}$/.test(value)
        ? true
        : value === undefined || value === ''
        ? t('moduleTools.auth.inputErrors.empty.OTP')
        : t('moduleTools.auth.inputErrors.invalid.OTP')
  })

  const spinner2 = ora(t('moduleTools.auth.messages.OTP.validating')).start()
  const valid = await validateOTP(login, OTPId, otp).finally(() =>
    spinner2.stop()
  )

  if (!valid) {
    console.log(chalk.red(`✖ ${t('moduleTools.auth.messages.OTP.invalid')}`))
    process.exit(0)
  }

  console.log(chalk.green(`✔ ${t('moduleTools.auth.messages.OTP.valid')}`))

  await new Promise(resolve => setTimeout(resolve, 2000))
  process.stdout.moveCursor(0, -1)
  process.stdout.clearLine(1)
}

export default validateOTPCode
