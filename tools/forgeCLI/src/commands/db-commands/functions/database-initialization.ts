import chalk from 'chalk'
import { spawn } from 'child_process'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import prompts from 'prompts'

import { executeCommand, killExistingProcess } from '../../../utils/helpers'
import { CLILoggingService } from '../../../utils/logging'
import getPocketbaseInstance from '../utils/pocketbase-utils'

/**
 * Database initialization utilities
 */

/**
 * Starts a PocketBase server instance
 */
export async function startPocketbaseServer(
  pbInstancePath: string
): Promise<number> {
  return new Promise((resolve, reject) => {
    const pbProcess = spawn(pbInstancePath, ['serve'], {
      stdio: ['ignore', 'pipe', 'pipe']
    })

    pbProcess.stdout?.on('data', data => {
      const output = data.toString()

      if (output.includes('Server started')) {
        resolve(pbProcess.pid!)
      }
    })

    pbProcess.stderr?.on('data', data => {
      reject(new Error(data.toString()))
    })

    pbProcess.on('error', error => {
      reject(error)
    })

    pbProcess.on('exit', code => {
      if (code !== 0) {
        reject(new Error(`PocketBase process exited with code ${code}`))
      }
    })
  })
}

/**
 * Generates a secure random master password
 */
export function generateSecureMasterPassword(): string {
  const length = 32

  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-='

  let password = ''

  for (let i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n))
  }

  return password
}

/**
 * Creates or copies environment file from example
 */
export function ensureEnvironmentFile(): string {
  const envPath = path.resolve(process.cwd(), 'env/.env.local')

  if (!fs.existsSync(envPath)) {
    CLILoggingService.warn(
      `Environment file not found at ${chalk.bold.blue(
        'env/.env.local'
      )}, creating a new one.`
    )

    const exampleEnvPath = path.resolve(process.cwd(), 'env/.env.example')

    if (fs.existsSync(exampleEnvPath)) {
      fs.copyFileSync(exampleEnvPath, envPath)
      dotenv.config({ path: envPath, quiet: true })
    } else {
      CLILoggingService.error(
        `Example environment file not found at ${chalk.bold.blue(
          'env/.env.example'
        )}, cannot create a new environment file.`
      )
      process.exit(1)
    }
  }

  return envPath
}

/**
 * Validates that PocketBase data directory doesn't already exist
 */
export function validatePocketBaseNotInitialized(pbDir: string): void {
  if (fs.existsSync(path.resolve(pbDir, 'pb_data'))) {
    CLILoggingService.actionableError(
      'PocketBase is already initialized in the specified directory, aborting.',
      'If you want to re-initialize, please remove the existing pb_data folder in the database directory.'
    )
    process.exit(1)
  }
}

/**
 * Creates PocketBase superuser
 */
export function createPocketBaseSuperuser(
  pbInstancePath: string,
  email: string,
  password: string
): void {
  try {
    CLILoggingService.step(
      `Initializing PocketBase database for ${chalk.bold.blue(email)}`
    )
    executeCommand(
      `${pbInstancePath} superuser create`,
      {
        stdio: ['pipe', 'pipe', 'pipe']
      },
      [email, password]
    )
    CLILoggingService.success(
      'PocketBase initialized and superuser created successfully.'
    )
  } catch (error) {
    CLILoggingService.error(
      `Failed to create superuser: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    )
    process.exit(1)
  }
}

/**
 * Runs database migrations
 */
export function runDatabaseMigrations(pbInstancePath: string): void {
  try {
    CLILoggingService.step('Migrating database schema to latest state...')
    executeCommand(`bun forge db generate-migrations`, {
      stdio: ['pipe', 'pipe', 'pipe']
    })
    CLILoggingService.success('Initial migration generated successfully.')
    executeCommand(`${pbInstancePath} migrate up`, {
      stdio: ['pipe', 'pipe', 'pipe']
    })
    CLILoggingService.success('Database schema migrated successfully.')
  } catch (error) {
    CLILoggingService.error(
      `Failed to generate initial migration: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    )
    process.exit(1)
  }
}

/**
 * Updates environment file with PocketBase credentials and master key
 */
export async function updateEnvironmentFile(
  envPath: string,
  email: string,
  password: string
): Promise<void> {
  const dotenvContentBuffer = fs.readFileSync(envPath)

  const parsedEnv = dotenv.parse(dotenvContentBuffer)

  parsedEnv['PB_HOST'] = parsedEnv['PB_HOST'] || 'http://localhost:8090'
  parsedEnv['PB_EMAIL'] = email
  parsedEnv['PB_PASSWORD'] = password

  if (!parsedEnv['MASTER_KEY']) {
    const promptsResponse = await prompts({
      type: 'confirm',
      name: 'generateMasterKey',
      message:
        'No MASTER_KEY found in env file. Do you want to generate a secure random master key?',
      initial: true
    })

    if (promptsResponse.generateMasterKey) {
      const masterKey = generateSecureMasterPassword()

      parsedEnv['MASTER_KEY'] = masterKey
      CLILoggingService.info(
        `Generated secure random master key: ${chalk.bold.blue(masterKey)}`
      )
    }
  }

  const updatedEnvContent = Object.entries(parsedEnv)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')

  fs.writeFileSync(envPath, updatedEnvContent)

  dotenv.populate(process.env as Record<string, string>, parsedEnv, {
    override: true
  })

  CLILoggingService.success(
    `Environment file updated with PocketBase credentials at ${chalk.bold.blue(
      'env/.env.local'
    )}`
  )
}

/**
 * Sets up default data in the database
 */
export async function setupDefaultData(
  email: string,
  password: string
): Promise<void> {
  const pb = await getPocketbaseInstance()

  CLILoggingService.step(
    'Pocketbase instance acquired, setting up default data...'
  )

  try {
    // Create default user
    const usersCollection = pb.collection('users')

    await usersCollection.create({
      email,
      password,
      passwordConfirm: password,
      verified: true,
      username: email.split('@')[0],
      name: 'Admin User',
      theme: 'system',
      language: 'en',
      fontScale: 1.0
    })

    CLILoggingService.success('Default data setup completed successfully.')
  } catch (error) {
    CLILoggingService.error(
      `Failed to set up default data: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    )
    process.exit(1)
  }
}

/**
 * Starts PocketBase server and returns the process ID
 */
export async function startPocketBaseAndGetPid(
  pbInstancePath: string
): Promise<number> {
  try {
    CLILoggingService.step('Starting PocketBase server...')

    const pbPid = await startPocketbaseServer(pbInstancePath)

    CLILoggingService.success(
      `PocketBase server started successfully with PID ${chalk.bold.blue(
        pbPid.toString()
      )}`
    )

    return pbPid
  } catch (error) {
    CLILoggingService.error(
      `Failed to start PocketBase server: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    )
    process.exit(1)
  }
}

/**
 * Completes the initialization process
 */
export function completeInitialization(pbPid: number): void {
  killExistingProcess(pbPid)

  CLILoggingService.success(
    'PocketBase server stopped, setup process complete.'
  )
  CLILoggingService.info(
    'You can now start the PocketBase server with `bun forge dev db`'
  )
}
