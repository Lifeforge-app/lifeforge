import { spawnSync } from 'child_process'
import prompts from 'prompts'

import executeCommand from './commands'
import Logging from './logging'

/**
 * Validates environment variables
 */
export function getEnvVars<const T extends readonly string[]>(
  requiredVars: T
): Record<T[number], string> {
  const vars: Record<string, string> = {}

  const missing: string[] = []

  for (const varName of requiredVars) {
    const value = process.env[varName]

    if (value) {
      vars[varName] = value
    } else {
      missing.push(varName)
    }
  }

  if (missing.length > 0) {
    Logging.actionableError(
      `Missing required environment variables: ${missing.join(', ')}`,
      'Use the "forge db init" command to set up the environment variables, or set them manually in your env/.env.local file'
    )
    process.exit(1)
  }

  return vars as Record<T[number], string>
}

export function getEnvVar(varName: string, fallback?: string): string {
  const value = process.env[varName]

  if (value) {
    return value
  }

  if (fallback !== undefined) {
    return fallback
  }

  Logging.actionableError(
    `Missing required environment variable: ${varName}`,
    'Use the "forge db init" command to set up the environment variables, or set them manually in your env/.env.local file'
  )
  process.exit(1)
}

/**
 * Kills existing processes matching the given keyword
 */
export function killExistingProcess(
  processKeywordOrPID: string | number
): number | undefined {
  try {
    if (typeof processKeywordOrPID === 'number') {
      process.kill(processKeywordOrPID)

      Logging.debug(
        `Killed process with PID: ${Logging.highlight(String(processKeywordOrPID))}`
      )

      return
    }

    const serverInstance = executeCommand(`pgrep -f "${processKeywordOrPID}"`, {
      exitOnError: false,
      stdio: 'pipe'
    })

    if (serverInstance) {
      executeCommand(`pkill -f "${processKeywordOrPID}"`)

      Logging.debug(
        `Killed process matching keyword: ${Logging.highlight(processKeywordOrPID)} (PID: ${Logging.highlight(serverInstance)})`
      )

      return parseInt(serverInstance, 10)
    }
  } catch {
    // No existing server instance found
  }
}

export function checkPortInUse(port: number): boolean {
  try {
    const result = spawnSync('nc', ['-zv', 'localhost', port.toString()], {
      stdio: 'pipe',
      encoding: 'utf8'
    })

    return result.status === 0
  } catch {
    return false
  }
}

export async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Checks if running in Docker mode
 */
export function isDockerMode(): boolean {
  return process.env.DOCKER_MODE === 'true'
}

/**
 * Prompts the user for confirmation
 */
export async function confirmAction(message: string): Promise<boolean> {
  const response = await prompts({
    type: 'confirm',
    name: 'confirmed',
    message,
    initial: false
  })

  return response.confirmed
}
