import chalk from 'chalk'
import ora from 'ora'
import { fetchOTP } from '../../../utils/OTP'

async function requestOTP(
  t: (key: string) => string,
  login: any
): Promise<string> {
  const spinner = ora(t('moduleTools.auth.messages.OTP.requesting')).start()
  const OTPId = await fetchOTP(login).finally(() => spinner.stop())

  if (OTPId === undefined || OTPId === null || OTPId === '') {
    console.log(chalk.red('✖ Failed to send OTP'))
    process.exit(0)
  }

  console.log(
    chalk.magenta(`\uf42f  ${t('moduleTools.auth.messages.OTP.sent')}`)
  )

  await new Promise(resolve => setTimeout(resolve, 2000))
  process.stdout.moveCursor(0, -1)
  process.stdout.clearLine(1)

  return OTPId
}

export default requestOTP
