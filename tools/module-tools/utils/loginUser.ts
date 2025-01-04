/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import chalk from 'chalk'
import ora from 'ora'
import prompts from 'prompts'

async function loginUser(): Promise<[boolean, any]> {
  const username = await prompts(
    {
      type: 'text',
      name: 'username',
      message: 'Username',
      validate: value => {
        if (!value) {
          return 'Username is required'
        }
        return true
      }
    },
    {
      onCancel: () => {
        console.log(chalk.red('✖ Login cancelled'))
        process.exit(0)
      }
    }
  )

  if (!username.username) {
    return [false, null]
  }

  const password = await prompts(
    {
      type: 'password',
      name: 'password',
      message: 'Password',
      validate: value => {
        if (!value) {
          return 'Password is required'
        }
        return true
      }
    },
    {
      onCancel: () => {
        console.log(chalk.red('✖ Login cancelled'))
        process.exit(0)
      }
    }
  )

  if (!password.password) {
    return [false, null]
  }

  const spinner = ora('Logging in').start()

  const login = await fetch(`${process.env.VITE_API_HOST}/user/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: username.username,
      password: password.password
    })
  })
    .then(async res => await res.json())
    .finally(() => spinner.stop())

  if (login.state === 'error') {
    console.error('Invalid credentials')
    return [false, null]
  }

  console.log(chalk.green('✔ Login successful'))
  await new Promise(resolve => setTimeout(resolve, 1000))
  process.stdout.moveCursor(0, -1)
  process.stdout.clearLine(1)
  process.stdout.moveCursor(0, -1)
  process.stdout.clearLine(1)
  process.stdout.moveCursor(0, -1)
  process.stdout.clearLine(1)

  return [true, login]
}

export default loginUser
