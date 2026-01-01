import chalk from 'chalk'
import { spawn, spawnSync } from 'child_process'
import PocketBase from 'pocketbase'

import { PB_BINARY_PATH, PB_KWARGS } from '@/constants/db'
import { executeCommand } from '@/utils/helpers'
import { getEnvVars } from '@/utils/helpers'
import CLILoggingService from '@/utils/logging'

import { killExistingProcess } from './helpers'

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
        CLILoggingService.actionableError(
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
  return new Promise((resolve, reject) => {
    const pbProcess = spawn(PB_BINARY_PATH, ['serve', ...PB_KWARGS], {
      stdio: ['ignore', 'pipe', 'pipe']
    })

    pbProcess.stdout?.on('data', data => {
      const output = data.toString()

      if (output.includes('Server started')) {
        resolve(pbProcess.pid!)
      }

      if (output.includes('bind: address already in use')) {
        CLILoggingService.actionableError(
          'Port 8090 is already in use by another application.',
          'Please free up the port. Are you using the port for non-pocketbase applications? (e.g., port forwarding, etc.)'
        )
        process.exit(1)
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
 * Starts PocketBase server and returns the process ID
 */
export async function startPocketbase(): Promise<(() => void) | null> {
  try {
    const pbRunning = checkRunningPBInstances(false)

    if (pbRunning) {
      CLILoggingService.step(
        'PocketBase server is already running, skipping...'
      )

      return null
    }

    CLILoggingService.step('Starting PocketBase server...')

    const pbPid = await startPBServer()

    CLILoggingService.success(
      `PocketBase server started successfully with PID ${chalk.bold.blue(
        pbPid.toString()
      )}`
    )

    return () => {
      killExistingProcess(pbPid)
    }
  } catch (error) {
    CLILoggingService.error(
      `Failed to start PocketBase server: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    )
    process.exit(1)
  }
}

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
    CLILoggingService.error(
      `Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
    process.exit(1)
  }
}
