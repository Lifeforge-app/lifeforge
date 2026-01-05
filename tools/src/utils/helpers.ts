import { spawnSync } from 'child_process'
import prompts from 'prompts'

import executeCommand from './commands'
import Logging from './logging'

/**
 * Validates and retrieves multiple required environment variables.
 *
 * @param requiredVars - Array of environment variable names to retrieve
 * @returns A record of variable names to their values
 * @throws Exits the process if any required variables are missing
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

/**
 * Retrieves a single environment variable.
 *
 * @param varName - The name of the environment variable
 * @param fallback - Optional fallback value if the variable is not set
 * @returns The environment variable value, or the fallback if provided
 * @throws Exits the process if the variable is not set and no fallback is provided
 */
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
 * Kills existing processes matching the given keyword or PID.
 *
 * @param processKeywordOrPID - Either a PID number or a keyword to match against running processes
 * @returns The PID of the killed process if found by keyword, undefined otherwise
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

/**
 * Checks if a specific port is currently in use.
 *
 * @param port - The port number to check
 * @returns True if the port is in use, false otherwise
 */
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

/**
 * Creates a promise that resolves after the specified delay.
 *
 * @param ms - The delay duration in milliseconds
 */
export async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Checks if the CLI is running inside a Docker container.
 *
 * @returns True if `DOCKER_MODE` environment variable is set to 'true'
 */
export function isDockerMode(): boolean {
  return process.env.DOCKER_MODE === 'true'
}

/**
 * Prompts the user for confirmation with a yes/no question.
 *
 * @param message - The confirmation message to display
 * @returns True if the user confirms, false otherwise
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
