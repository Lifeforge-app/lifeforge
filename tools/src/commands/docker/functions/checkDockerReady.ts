import { ROOT_DIR } from '@/constants/constants'
import executeCommand from '@/utils/commands'
import Logging from '@/utils/logging'

const REQUIRED_CONTAINERS = [
  'lifeforge-db',
  'lifeforge-server',
  'lifeforge-client'
]



/**
 * Checks if Docker is available and LifeForge containers are initialized.
 * @returns true if Docker is ready, false otherwise
 */
export default function checkDockerReady(): boolean {
  try {
    // Check if Docker is running
    executeCommand('docker info', { stdio: 'pipe' })
  } catch {
    Logging.actionableError(
      'Docker is not running',
      'Start Docker Desktop or the Docker daemon first'
    )

    return false
  }

  try {
    // Check if LifeForge containers exist
    const result = executeCommand('docker ps --format "{{.Names}}"', {
      cwd: ROOT_DIR,
      stdio: 'pipe'
    }).toString()

    const runningContainers = result.split('\n').map(name => name.trim())

    const missingContainers = REQUIRED_CONTAINERS
    .filter(
      container => !runningContainers.includes(container)
    )

    if (missingContainers.length > 0) {
      Logging.actionableError(
        `LifeForge containers not running: ${missingContainers.join(', ')}`,
        'Run "docker compose up -d" first to start the containers'
      )

      return false
    }
  } catch {
    Logging.actionableError(
      'Failed to check Docker containers',
      'Ensure Docker is running and docker-compose.yaml exists'
    )

    return false
  }

  return true
}
