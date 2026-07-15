import { hash } from 'argon2'
import dotenv from 'dotenv'
import path from 'node:path'
import readline from 'node:readline'
import PocketBase from 'pocketbase'

// TODO: Better prompting

dotenv.config({
  path: path.resolve(import.meta.dirname, '..', 'env', '.env.local')
})

const { PB_HOST, PB_EMAIL, PB_PASSWORD } = process.env

function promptPassword(email: string): Promise<string> {
  return new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    process.stdout.write(`Enter new password for ${email}: `)

    let password = ''

    process.stdin.setRawMode(true)
    process.stdin.resume()
    process.stdin.setEncoding('utf-8')

    const onData = (char: string) => {
      const code = char.charCodeAt(0)

      if (code === 13 || code === 10) {
        process.stdout.write('\n')
        process.stdin.setRawMode(false)
        process.stdin.pause()
        process.stdin.off('data', onData)
        rl.close()

        if (password.length < 8) {
          console.log('Password must be at least 8 characters.')
          resolve(promptPassword(email))
        } else {
          resolve(password)
        }
      } else if (code === 127 || code === 8) {
        if (password.length > 0) {
          password = password.slice(0, -1)
          process.stdout.write('\b \b')
        }
      } else if (code === 3) {
        console.log('\nCancelled.')
        process.exit(1)
      } else {
        password += char
        process.stdout.write('*')
      }
    }

    process.stdin.on('data', onData)
  })
}

async function main() {
  if (!PB_HOST || !PB_EMAIL || !PB_PASSWORD) {
    console.error('Missing PB_HOST, PB_EMAIL, or PB_PASSWORD in env/.env.local')
    process.exit(1)
  }

  const pb = new PocketBase(PB_HOST)
  pb.autoCancellation(false)

  console.log(`Connecting to PocketBase at ${PB_HOST}...`)

  await pb
    .collection('_superusers')
    .authWithPassword(PB_EMAIL, PB_PASSWORD)
    .catch(err => {
      console.error('Superuser authentication failed:', err.message)
      process.exit(1)
    })

  if (!pb.authStore.isSuperuser || !pb.authStore.isValid) {
    console.error('Invalid superuser credentials')
    process.exit(1)
  }

  console.log('Authenticated as superuser.\n')

  const users = await pb.collection('users').getFullList()

  console.log(`Found ${users.length} user(s).\n`)

  const needsReset = users.filter(
    user => !(user as Record<string, unknown>).auth_password_hash
  )

  if (needsReset.length === 0) {
    console.log('All users already have auth_password_hash set. Nothing to do.')
    pb.authStore.clear()
    process.exit(0)
  }

  console.log(
    `${needsReset.length} user(s) need new passwords. Enter a password for each:\n`
  )

  for (const user of needsReset) {
    const password = await promptPassword(user.email)
    const confirm = await promptPassword(`Confirm password for ${user.email}`)

    if (password !== confirm) {
      console.log('Passwords do not match. Skipping this user.\n')
      continue
    }

    const hashedPassword = await hash(password, {
      type: 2 // argon2id
    })

    await pb
      .collection('users')
      .update(user.id, { auth_password_hash: hashedPassword })

    console.log(`  Password set for ${user.email}.\n`)
  }

  pb.authStore.clear()
  console.log('Done.')
}

main()
