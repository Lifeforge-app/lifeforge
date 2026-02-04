import chalk from 'chalk'
import prompts from 'prompts'

import executeCommand from './commands'
import logger from './logger'

/**
 * Validates and retrieves multiple required environment variables.
 *
 * @param requiredVars - Array of environment variable names to retrieve
 * @param fallback - Optional fallback values for environment variables
 * @returns A record of variable names to their values
 * @throws Exits the process if any required variables are missing
 */
export function getEnvVars<const T extends readonly string[]>(
  requiredVars: T,
  fallback?: Record<string, string>
): Record<T[number], string> {
  const vars: Record<string, string> = {}

  const missing: string[] = []

  for (const varName of requiredVars) {
    const value = process.env[varName]

    if (value) {
      vars[varName] = value
    } else if (fallback?.[varName]) {
      vars[varName] = fallback[varName]
    } else {
      missing.push(varName)
    }
  }

  if (missing.length > 0) {
    logger.error(
      `Missing required environment variables: ${missing.join(', ')}`
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

  logger.error(`Missing required environment variable: ${chalk.red(varName)}`)
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

      logger.debug(
        `Killed process with PID: ${chalk.blue(String(processKeywordOrPID))}`
      )

      return
    }

    const serverInstance = executeCommand(`pgrep -f "${processKeywordOrPID}"`, {
      exitOnError: false
    })

    if (serverInstance) {
      executeCommand(`pkill -f "${processKeywordOrPID}"`, {
        exitOnError: false
      })

      logger.debug(
        `Killed process matching keyword: ${chalk.blue(processKeywordOrPID)} (PID: ${chalk.blue(serverInstance)})`
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
    executeCommand('nc', { exitOnError: false }, [
      '-zv',
      'localhost',
      port.toString()
    ])

    return true
  } catch {
    return false
  }
}

/**
 * Checks if a specific port is currently in use.
 *
 * @param port - The port number to check
 * @returns True if the port is in use, false otherwise
 */
export function checkAddressInUse(address: string, port: string): boolean {
  logger.debug(
    `Checking if address ${chalk.blue(address)}:${chalk.blue(port)} is in use...`
  )

  try {
    executeCommand('nc', { exitOnError: false }, ['-zv', address, port])

    const lsofOutput = executeCommand('lsof', { exitOnError: false }, [
      '-i',
      `@${address}:${port}`,
      '-sTCP:LISTEN'
    ])

    const lines = lsofOutput.trim().split('\n')

    const dataLine = lines.find(line => !line.startsWith('COMMAND'))

    if (dataLine) {
      const parts = dataLine.trim().split(/\s+/)

      const processName = parts[0]

      const pid = parts[1]

      logger.error(
        `Address ${chalk.blue(address)}:${chalk.blue(port)} is in use by process: ${chalk.blue(processName)} (PID: ${chalk.blue(pid)})`
      )
    } else {
      logger.error(
        `Address ${chalk.blue(address)}:${chalk.blue(port)} is in use, but no process info found.`
      )
    }

    return true
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
