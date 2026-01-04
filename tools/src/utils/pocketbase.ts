import { spawn } from 'child_process'
import PocketBase from 'pocketbase'

import { PB_BINARY_PATH, PB_KWARGS } from '@/constants/db'
import { getEnvVars } from '@/utils/helpers'
import Logging from '@/utils/logging'

import executeCommand from './commands'
import { killExistingProcess } from './helpers'

// Triple underscore separates username from module name
const USERNAME_SEPARATOR = {
  code: '$',
  pb: '___'
}

// Double underscore separates module name from collection name
const COLLECTION_SEPARATOR = {
  code: '__',
  pb: '__'
}

/**
 * Parse a PocketBase collection name into components
 *
 * Examples:
 * - "melvinchia3636___melvinchia3636$melvinchia3636$invoice_maker__clients" → { username: "melvinchia3636", moduleName: "invoice_maker", collectionName: "clients" }
 * - "achievements__badges" → { moduleName: "achievements", collectionName: "badges" }
 */
export function parseCollectionName(
  str: string,
  type: 'code' | 'pb',
  fallbackModuleName?: string
): {
  username?: string
  moduleName: string
  collectionName: string
} {
  const userNameSeparator = USERNAME_SEPARATOR[type]

  const collectionSeparator = COLLECTION_SEPARATOR[type]

  if (str.includes(userNameSeparator)) {
    const [username, remainder] = str.split(userNameSeparator, 2)

    if (!remainder.includes(collectionSeparator)) {
      if (!fallbackModuleName) {
        Logging.actionableError(
          `Invalid collection name: ${Logging.highlight(str)}`,
          'Collection names must follow the format: module__collection or username___module__collection'
        )
        process.exit(1)
      }

      return {
        moduleName: fallbackModuleName,
        collectionName: str
      }
    }

    const [moduleName, collectionName] = remainder.split(collectionSeparator, 2)

    return {
      username,
      moduleName,
      collectionName
    }
  }

  if (!str.includes(collectionSeparator)) {
    if (!fallbackModuleName) {
      Logging.actionableError(
        `Invalid collection name: ${Logging.highlight(str)}`,
        'Collection names must follow the format: module__collection or username___module__collection'
      )
      process.exit(1)
    }

    return {
      moduleName: fallbackModuleName,
      collectionName: str
    }
  }

  const [moduleName, collectionName] = str.split(collectionSeparator, 2)

  return {
    moduleName,
    collectionName
  }
}

/**
 * Verifies if a PID is actually running and is a PocketBase process
 */
function isValidPocketbaseProcess(pid: number): boolean {
  try {
    // First check if process exists using kill -0 (doesn't actually kill)
    process.kill(pid, 0)

    // Verify it's actually a pocketbase process by checking the command
    const psResult = executeCommand(`ps -p ${pid} -o comm=`, {
      exitOnError: false,
      stdio: 'pipe'
    })

    return psResult?.toLowerCase().includes('pocketbase') ?? false
  } catch {
    // Process doesn't exist or we don't have permission
    return false
  }
}

/**
 * Checks for running PocketBase instances
 */
export function checkRunningPBInstances(exitOnError = true): boolean {
  try {
    const result = executeCommand(`pgrep -f "pocketbase serve"`, {
      exitOnError: false,
      stdio: 'pipe'
    })

    if (!result?.trim()) {
      return false
    }

    // pgrep can return multiple PIDs (one per line)
    const pids = result
      .trim()
      .split('\n')
      .map(pid => parseInt(pid.trim(), 10))
      .filter(pid => !isNaN(pid))

    // Verify each PID is actually a running pocketbase process
    const validPids = pids.filter(isValidPocketbaseProcess)

    if (validPids.length > 0) {
      if (exitOnError) {
        Logging.actionableError(
          `PocketBase is already running (PID: ${validPids.join(', ')})`,
          'Stop the existing instance with "pkill -f pocketbase" before proceeding'
        )
        process.exit(1)
      }

      return true
    }
  } catch {
    // No existing instance found, continue with the script
  }

  return false
}

/**
 * Starts a PocketBase server instance
 */
export async function startPBServer(): Promise<number> {
  Logging.debug('Starting PocketBase server...')

  return new Promise((resolve, reject) => {
    const pbProcess = spawn(PB_BINARY_PATH, ['serve', ...PB_KWARGS], {
      stdio: ['ignore', 'pipe', 'pipe']
    })

    pbProcess.stdout?.on('data', data => {
      const output = data.toString()

      if (output.includes('Server started')) {
        Logging.debug(`PocketBase server started (PID: ${pbProcess.pid})`)
        resolve(pbProcess.pid!)
      }

      if (output.includes('bind: address already in use')) {
        Logging.actionableError(
          'Port 8090 is already in use',
          'Run "pkill -f pocketbase" to stop existing instances, or check for other apps using port 8090'
        )
        process.exit(1)
      }
    })

    pbProcess.stderr?.on('data', data => {
      const error = data.toString().trim()

      Logging.debug(`PocketBase stderr: ${error}`)
      reject(new Error(error))
    })

    pbProcess.on('error', error => {
      Logging.debug(`PocketBase spawn error: ${error.message}`)
      reject(error)
    })

    pbProcess.on('exit', code => {
      if (code !== 0) {
        Logging.debug(`PocketBase exited with code ${code}`)
        reject(new Error(`PocketBase process exited with code ${code}`))
      }
    })
  })
}

/**
 * Starts PocketBase server and returns the process ID
 */
export async function startPocketbase(): Promise<(() => void) | null> {
  try {
    const pbRunning = checkRunningPBInstances(false)

    if (pbRunning) {
      Logging.debug('PocketBase is already running')

      return null
    }

    const pbPid = await startPBServer()

    return () => {
      killExistingProcess(pbPid)
    }
  } catch (error) {
    Logging.actionableError(
      `Failed to start PocketBase server: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'Run "bun forge db init" to initialize the database or check if the PocketBase binary exists'
    )
    process.exit(1)
  }
}

/**
 * Gets a PocketBase instance.
 *
 * If `createNewInstance` is true, and there is no existing instance,
 * it will start a new PocketBase instance.
 */
export default async function getPBInstance(createNewInstance = true): Promise<{
  pb: PocketBase
  killPB: (() => void) | null
}> {
  const killPB = createNewInstance ? await startPocketbase() : null

  const { PB_HOST, PB_EMAIL, PB_PASSWORD } = getEnvVars([
    'PB_HOST',
    'PB_EMAIL',
    'PB_PASSWORD'
  ])

  const pb = new PocketBase(PB_HOST)

  try {
    await pb.collection('_superusers').authWithPassword(PB_EMAIL, PB_PASSWORD)

    if (!pb.authStore.isSuperuser || !pb.authStore.isValid) {
      throw new Error('Invalid credentials or insufficient permissions')
    }

    return {
      pb,
      killPB
    }
  } catch (error) {
    Logging.actionableError(
      `Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'Check PB_EMAIL and PB_PASSWORD in env/.env.local are correct'
    )
    process.exit(1)
  }
}
