import chalk from 'chalk'
import ora from 'ora'
import prompts from 'prompts'

async function loginUser(
  existedUsername: string = '',
  existedPassword: string = '',
  t: (key: string) => string
): Promise<[boolean, any]> {
  let username = existedUsername
  let password = existedPassword

  if (!username) {
    const usernamePrompt = await prompts(
      {
        type: 'text',
        name: 'username',
        message: t('moduleTools.auth.prompts.username'),
        validate: value => {
          if (!value) {
            return t('moduleTools.auth.inputErrors.empty.username')
          }
          return true
        }
      },
      {
        onCancel: () => {
          console.log(
            chalk.red(`✖ ${t('moduleTools.auth.messages.auth.cancelled')}`)
          )
          process.exit(0)
        }
      }
    )

    if (!usernamePrompt.username) {
      return [false, null]
    }

    username = usernamePrompt.username
  }

  if (!password) {
    const passwordPrompt = await prompts(
      {
        type: 'password',
        name: 'password',
        message: t('moduleTools.auth.prompts.password'),
        validate: value => {
          if (!value) {
            return t('moduleTools.auth.inputErrors.empty.password')
          }
          return true
        }
      },
      {
        onCancel: () => {
          console.log(
            chalk.red(`✖ ${t('moduleTools.auth.messages.auth.cancelled')}`)
          )
          process.exit(0)
        }
      }
    )

    if (!passwordPrompt.password) {
      return [false, null]
    }

    password = passwordPrompt.password
  }

  const spinner = ora(t('moduleTools.auth.messages.auth.validating')).start()

  const login = await fetch(`${process.env.VITE_API_HOST}/user/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: username,
      password
    })
  })
    .then(async res => await res.json())
    .finally(() => spinner.stop())

  if (login.state === 'error') {
    console.error(chalk.red(`✖ ${t('moduleTools.auth.messages.auth.failed')}`))
    return [false, null]
  }

  console.log(chalk.green(`✔ ${t('moduleTools.auth.messages.auth.success')}`))
  await new Promise(resolve => setTimeout(resolve, 1000))

  process.stdout.moveCursor(0, -1)
  process.stdout.clearLine(1)

  if (!(existedUsername === username && existedPassword === password)) {
    process.stdout.moveCursor(0, -1)
    process.stdout.clearLine(1)
    process.stdout.moveCursor(0, -1)
    process.stdout.clearLine(1)
  }

  return [true, login]
}

export default loginUser
