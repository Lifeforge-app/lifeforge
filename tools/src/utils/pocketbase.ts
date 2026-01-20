import { spawn } from 'child_process'
import PocketBase from 'pocketbase'

import { PB_BINARY_PATH, PB_KWARGS } from '@/constants/db'
import { getEnvVars } from '@/utils/helpers'
import logger from '@/utils/logger'

import executeCommand from './commands'
import { killExistingProcess } from './helpers'

/**
 * Verifies if a PID is actually running and is a PocketBase process.
 *
 * @param pid - The process ID to verify
 * @returns True if the PID is a valid running PocketBase process, false otherwise
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
 * Checks for running PocketBase instances.
 *
 * @param exitOnError - If true, exits the process when PocketBase is already running
 * @returns True if PocketBase instances are running, false otherwise
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
        logger.actionableError(
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
 * Starts a PocketBase server instance in a child process.
 *
 * @returns A promise that resolves with the process ID when the server starts
 * @throws Rejects if the server fails to start or encounters an error
 */
export async function startPBServer(): Promise<number> {
  logger.debug('Starting PocketBase server...')

  return new Promise((resolve, reject) => {
    const pbProcess = spawn(PB_BINARY_PATH, ['serve', ...PB_KWARGS], {
      stdio: ['ignore', 'pipe', 'pipe']
    })

    pbProcess.stdout?.on('data', data => {
      const output = data.toString()

      if (output.startsWith('Error:')) {
        reject(new Error(output.trim()))

        return
      }

      if (output.includes('Server started')) {
        logger.debug(`PocketBase server started (PID: ${pbProcess.pid})`)
        resolve(pbProcess.pid!)
      }

      if (output.includes('bind: address already in use')) {
        logger.actionableError(
          'Port 8090 is already in use',
          'Run "pkill -f pocketbase" to stop existing instances, or check for other apps using port 8090'
        )
        process.exit(1)
      }
    })

    pbProcess.stderr?.on('data', data => {
      const error = data.toString().trim()

      logger.debug(`PocketBase stderr: ${error}`)
      reject(new Error(error))
    })

    pbProcess.on('error', error => {
      logger.debug(`PocketBase spawn error: ${error.message}`)
      reject(error)
    })

    pbProcess.on('exit', code => {
      if (code !== 0) {
        logger.debug(`PocketBase exited with code ${code}`)
        reject(new Error(`PocketBase process exited with code ${code}`))
      }
    })
  })
}

/**
 * Starts PocketBase server if not already running.
 *
 * @returns A cleanup function to kill the PocketBase process, or null if already running
 */
export async function startPocketbase(): Promise<(() => void) | null> {
  try {
    const pbRunning = checkRunningPBInstances(false)

    if (pbRunning) {
      logger.debug('PocketBase is already running')

      return null
    }

    const pbPid = await startPBServer()

    return () => {
      killExistingProcess(pbPid)
    }
  } catch (error) {
    logger.actionableError(
      `Failed to start PocketBase server: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'Run "bun forge db init" to initialize the database or check if the PocketBase binary exists'
    )
    process.exit(1)
  }
}

/**
 * Gets an authenticated PocketBase instance.
 *
 * Optionally starts a new PocketBase server if none is running, then authenticates
 * using credentials from environment variables.
 *
 * @param createNewInstance - If true, starts a new PocketBase server if none is running
 * @returns The authenticated PocketBase client and an optional cleanup function
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
    logger.actionableError(
      `Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'Check PB_EMAIL and PB_PASSWORD in env/.env.local are correct'
    )
    process.exit(1)
  }
}
