import boxen from 'boxen'
import chalk from 'chalk'
import ora from 'ora'
import prompts from 'prompts'
import { toCamelCase } from '@utils/strings'
import { ROUTES } from '../../constants/routes'
import { fetchOTP, validateOTP } from '../../utils/OTP'

const warnings = [
  'Action Scope',
  'Recoverability',
  'Dependencies',
  'System Impact',
  'Backup Recommendation',
  'User Responsibility'
]

function printDisclaimer(t: (key: string) => string): void {
  console.log(
    chalk.red(`\n${t('moduleTools.features.delete.beforeProceed')}\n`)
  )
  console.log(
    boxen(
      warnings
        .map(
          (title, index) =>
            `${chalk.yellow.bold(
              `${(index + 1).toString().padStart(2, '0')}. `
            )}${chalk.bold(
              t(
                `moduleTools.features.delete.warnings.${toCamelCase(
                  title
                )}.title`
              )
            )}\n${chalk.gray(
              t(
                `moduleTools.features.delete.warnings.${toCamelCase(
                  title
                )}.desc`
              )
            )}`
        )
        .join('\n\n'),
      {
        padding: {
          top: 1,
          right: 2,
          bottom: 1,
          left: 2
        },
        width: 80,
        borderColor: 'yellow',
        borderStyle: 'double',
        title: chalk.bold(
          `\uf071 ${t('moduleTools.features.delete.warning').toUpperCase()}`
        )
      }
    )
  )
}

async function deleteModule(
  login: any,
  t: (key: string) => string
): Promise<void> {
  printDisclaimer(t)
  console.log()

  const confirm = await prompts({
    type: 'confirm',
    name: 'value',
    message: t('moduleTools.features.delete.prompts.proceedConfirmation')
  })

  if (confirm.value !== true) {
    console.log(
      chalk.red(`✖ ${t('moduleTools.features.delete.messages.cancelled')}`)
    )
    process.exit(0)
  }

  const confirmAgain = await prompts({
    type: 'text',
    name: 'value',
    message: t(
      'moduleTools.features.delete.prompts.proceedConfirmation2'
    ).replace('{}', chalk.yellow('I know what I am doing'))
  })

  if (confirmAgain.value !== 'I know what I am doing') {
    console.log(
      chalk.red(`✖ ${t('moduleTools.features.delete.messages.cancelled')}`)
    )
    process.exit(0)
  }

  const modules = ROUTES.flatMap(route =>
    route.items.filter(e => e.togglable).map(item => item.name)
  ).sort((a, b) => a.localeCompare(b))

  const { module } = await prompts(
    {
      type: 'autocomplete',
      name: 'module',
      message: t('moduleTools.features.delete.prompts.selectModule'),
      choices: modules.map(module => ({ title: module, value: module })),
      validate: value => {
        if (value === undefined) {
          return 'Module is required'
        }
        return true
      }
    },
    {
      onCancel: () => {
        console.log(
          chalk.red(`✖ ${t('moduleTools.features.delete.messages.cancelled')}`)
        )
        process.exit(0)
      }
    }
  )

  const confirmFinal = await prompts({
    type: 'confirm',
    name: 'value',
    message: `Are you sure you want to delete the module "${chalk.bold.blue(
      module
    )}"?`
  })

  if (confirmFinal.value !== true) {
    console.log(
      chalk.red(`✖ ${t('moduleTools.features.delete.messages.cancelled')}`)
    )
    process.exit(0)
  }

  const confirmSekaliLagi = await prompts({
    type: 'text',
    name: 'value',
    message: `Please type the module name "${chalk.yellow(
      module
    )}" to confirm deletion.`
  })

  if (confirmSekaliLagi.value !== module) {
    console.log(
      chalk.red(`✖ ${t('moduleTools.features.delete.messages.cancelled')}`)
    )
    process.exit(0)
  }

  const spinner = ora(t('moduleTools.auth.requestingOTP')).start()
  const OTPId = await fetchOTP(login).finally(() =>
    setTimeout(() => spinner.stop(), 1000)
  )

  if (OTPId === undefined) {
    console.log(chalk.red('✖ Failed to send OTP'))
    process.exit(0)
  }

  console.log(chalk.magenta('\uf42f  An OTP has been sent to your email'))

  const { otp } = await prompts({
    type: 'password',
    name: 'otp',

    message: 'Enter the OTP you received',
    format: value => value.trim(),
    validate: value => {
      if (value === undefined) {
        return 'OTP is required'
      }
      if (!/^\d{6}$/.test(value)) {
        return 'OTP must be a 6-digit number'
      }
      return true
    }
  })

  const spinner2 = ora(t('moduleTools.auth.validatingOTP')).start()
  const valid = await validateOTP(login, OTPId, otp).finally(() =>
    setTimeout(() => spinner2.stop(), 1000)
  )

  if (!valid) {
    console.log(chalk.red('✖ Invalid OTP'))
    process.exit(0)
  }
}

export default deleteModule
