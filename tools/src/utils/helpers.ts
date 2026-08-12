import chalk from 'chalk'
import net from 'node:net'
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

    const pids = findProcessIdsByCommandLine(processKeywordOrPID)

    if (pids.length > 0) {
      killProcessesByPids(pids)

      logger.debug(
        `Killed process matching keyword: ${chalk.blue(processKeywordOrPID)} (PID: ${chalk.blue(pids.join(', '))})`
      )

      return parseInt(pids[0], 10)
    }
  } catch {
    // No existing server instance found
  }
}

/**
 * Finds the PIDs of running processes whose command line matches the given keyword.
 *
 * @param keyword - Regex keyword to match against process command lines
 * @returns An array of matching PIDs
 */
export function findProcessIdsByCommandLine(keyword: string): string[] {
  try {
    if (process.platform === 'win32') {
      const escaped = keyword.replace(/\\/g, '\\\\').replace(/'/g, "''")

      const script = `Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -match '${escaped}' } | Select-Object -ExpandProperty ProcessId`

      const output = executeCommand(
        'powershell',
        { exitOnError: false },
        ['-NoProfile', '-NonInteractive', '-Command', script]
      )

      return output
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
    }

    const output = executeCommand(`pgrep -f "${keyword}"`, {
      exitOnError: false
    })

    return output
      .trim()
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
  } catch {
    return []
  }
}

/**
 * Kills the processes with the given PIDs (cross-platform).
 *
 * @param pids - The PIDs to kill
 */
export function killProcessesByPids(pids: string[]): void {
  if (process.platform === 'win32') {
    executeCommand(
      'powershell',
      { exitOnError: false },
      [
        '-NoProfile',
        '-NonInteractive',
        '-Command',
        `Stop-Process -Id ${pids.join(',')} -Force -ErrorAction SilentlyContinue`
      ]
    )

    return
  }

  for (const pid of pids) {
    try {
      process.kill(Number(pid))
    } catch {
      // Process may have already exited
    }
  }
}

/**
 * Checks if a port is currently in use by attempting to bind to it (cross-platform).
 *
 * @param port - The port number to check
 * @param host - The host to bind to (defaults to 127.0.0.1)
 * @returns True if the port is in use, false otherwise
 */
export function isPortInUse(port: number, host = '127.0.0.1'): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer()

    server.unref()

    server.once('error', error => {
      const code = (error as NodeJS.ErrnoException).code

      resolve(code === 'EADDRINUSE' || code === 'EACCES')
    })

    server.once('listening', () => {
      server.close(() => resolve(false))
    })

    server.listen(port, host)
  })
}

/**
 * Checks if a specific port is currently in use.
 *
 * @param port - The port number to check
 * @returns True if the port is in use, false otherwise
 */
export async function checkPortInUse(port: number): Promise<boolean> {
  return isPortInUse(port)
}

/**
 * Returns a human-readable description of the process listening on a port.
 *
 * @param port - The port number
 * @returns A string like "node.exe (PID: 1234)", or null if it cannot be determined
 */
export function getPortProcessInfo(port: number): string | null {
  try {
    if (process.platform === 'win32') {
      const netstatOutput = executeCommand(
        'netstat',
        { exitOnError: false },
        ['-ano', '-p', 'tcp']
      )

      const line = netstatOutput
        .split('\n')
        .find(l => l.includes(`:${port}`) && l.includes('LISTENING'))

      if (!line) {
        return null
      }

      const pid = line.trim().split(/\s+/).pop()

      const tasklistOutput = executeCommand(
        'tasklist',
        { exitOnError: false },
        ['/FO', 'CSV', '/NH']
      )

      const taskLine = tasklistOutput
        .split('\n')
        .find(l => l.split('","')[1]?.trim() === String(pid))

      const name = taskLine
        ? taskLine.replace(/^"/, '').split('","')[0]
        : 'unknown'

      return `${name} (PID: ${pid})`
    }

    const lsofOutput = executeCommand('lsof', { exitOnError: false }, [
      '-i',
      `:${port}`,
      '-sTCP:LISTEN'
    ])

    const dataLine = lsofOutput
      .split('\n')
      .find(line => !line.startsWith('COMMAND'))

    if (!dataLine) {
      return null
    }

    const parts = dataLine.trim().split(/\s+/)

    return `${parts[0]} (PID: ${parts[1]})`
  } catch {
    return null
  }
}

/**
 * Checks if a specific address:port is currently in use.
 *
 * @param address - The address to check
 * @param port - The port to check
 * @returns True if the address is in use, false otherwise
 */
export async function checkAddressInUse(
  address: string,
  port: string
): Promise<boolean> {
  logger.debug(
    `Checking if address ${chalk.blue(address)}:${chalk.blue(port)} is in use...`
  )

  const inUse = await isPortInUse(Number(port))

  if (inUse) {
    const info = getPortProcessInfo(Number(port))

    if (info) {
      logger.error(
        `Address ${chalk.blue(address)}:${chalk.blue(port)} is in use by process: ${chalk.blue(info)}`
      )
    } else {
      logger.error(
        `Address ${chalk.blue(address)}:${chalk.blue(port)} is in use, but no process info found.`
      )
    }
  }

  return inUse
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
