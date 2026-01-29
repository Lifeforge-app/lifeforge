import { execSync } from 'child_process'

import executeCommand from './commands'
import { isDockerMode } from './helpers'
import logger from './logger'

const SERVER_CONTAINER = 'lifeforge-server'

/**
 * Checks if Docker daemon is running.
 */
export function isDockerRunning(): boolean {
  try {
    execSync('docker info', { stdio: 'pipe' })

    return true
  } catch {
    return false
  }
}

/**
 * Checks if a specific Docker container is running.
 */
export function isContainerRunning(containerName: string): boolean {
  try {
    const status = execSync(
      `docker ps --filter "name=${containerName}" --format "{{.Status}}"`,
      { encoding: 'utf8', stdio: 'pipe' }
    ).trim()

    return status.length > 0
  } catch {
    return false
  }
}

/**
 * Restarts the Docker server container to pick up module changes.
 * Only works when running locally (not from inside Docker).
 */
export function restartServerContainer(): void {
  if (isDockerMode()) {
    logger.warn('Cannot restart Docker from inside a container')

    return
  }

  if (!isDockerRunning()) {
    return
  }

  if (!isContainerRunning(SERVER_CONTAINER)) {
    logger.debug('Server container not running, skipping restart')

    return
  }

  try {
    logger.info('Restarting Docker server container...')
    execSync(`docker restart ${SERVER_CONTAINER}`, { stdio: 'inherit' })
    logger.success('Server container restarted')
  } catch (error) {
    logger.error(`Failed to restart Docker server.`)
    logger.debug(`Error details: ${error}`)
  }
}

/**
 * Automatically restarts the server if Docker is detected and running.
 * Call this after module install/uninstall operations.
 */
export function smartReloadServer(): void {
  if (isDockerMode()) {
    return
  }

  if (isDockerRunning() && isContainerRunning(SERVER_CONTAINER)) {
    restartServerContainer()
  } else {
    logger.info('Refresh the browser to load module changes')
  }
}

export function stopService(serviceName: string): void {
  if (!isDockerRunning()) {
    return
  }

  try {
    logger.debug(`Stopping Docker service ${serviceName}...`)
    executeCommand(`docker stop ${serviceName}`, { stdio: 'inherit' })
    logger.success(`Service ${serviceName} stopped`)
  } catch (error) {
    logger.error(`Failed to stop Docker service ${serviceName}.`)
    logger.debug(`Error details: ${error}`)
  }
}

export function startService(serviceName: string): void {
  if (!isDockerRunning()) {
    return
  }

  try {
    logger.debug(`Starting Docker service ${serviceName}...`)
    executeCommand(`docker start ${serviceName}`, { stdio: 'inherit' })
    logger.success(`Service ${serviceName} started`)
  } catch (error) {
    logger.error(`Failed to start Docker service ${serviceName}.`)
    logger.debug(`Error details: ${error}`)
  }
}
