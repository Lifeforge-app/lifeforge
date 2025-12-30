import chalk from 'chalk'
import fs from 'fs'
import os from 'os'
import path from 'path'

import { PB_BINARY_PATH, PB_DIR } from '@/constants/db'
import { executeCommand, isDockerMode } from '@/utils/helpers'
import CLILoggingService from '@/utils/logging'

const PB_VERSION = '0.35.0'

/**
 * Downloads PocketBase binary for the current OS and architecture
 * Skips download in Docker mode (binary is provided by the container)
 */
export async function downloadPocketBaseBinary(): Promise<void> {
  // Skip in Docker mode - binary is provided by the container
  if (isDockerMode()) {
    CLILoggingService.debug('Docker mode detected, skipping binary download')

    return
  }

  if (fs.existsSync(PB_BINARY_PATH)) {
    CLILoggingService.debug(
      'PocketBase binary already exists, skipping download'
    )

    return
  }

  CLILoggingService.step('PocketBase binary not found, downloading...')

  // Detect OS
  const platform = os.platform()

  let osName: string

  switch (platform) {
    case 'darwin':
      osName = 'darwin'
      break
    case 'linux':
      osName = 'linux'
      break
    case 'win32':
      osName = 'windows'
      break
    default:
      CLILoggingService.error(`Unsupported platform: ${platform}`)
      process.exit(1)
  }

  // Detect architecture
  const arch = os.arch()

  let archName: string

  switch (arch) {
    case 'arm64':
      archName = 'arm64'
      break
    case 'x64':
      archName = 'amd64'
      break
    default:
      CLILoggingService.error(`Unsupported architecture: ${arch}`)
      process.exit(1)
  }

  const downloadUrl = `https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_${osName}_${archName}.zip`

  CLILoggingService.info(
    `Downloading PocketBase v${PB_VERSION} for ${osName}/${archName}...`
  )

  try {
    const zipPath = path.join(PB_DIR, 'pocketbase.zip')

    // Download the zip file
    const response = await fetch(downloadUrl)

    if (!response.ok) {
      throw new Error(
        `Failed to download: ${response.status} ${response.statusText}`
      )
    }

    const arrayBuffer = await response.arrayBuffer()

    fs.writeFileSync(zipPath, Buffer.from(arrayBuffer))

    CLILoggingService.debug('Download complete, extracting...')

    // Extract using unzip command
    executeCommand(`unzip -o "${zipPath}" -d "${PB_DIR}"`, {
      stdio: ['pipe', 'pipe', 'pipe']
    })

    // Clean up zip file and unnecessary files
    fs.unlinkSync(zipPath)

    const changelogPath = path.join(PB_DIR, 'CHANGELOG.md')

    const licensePath = path.join(PB_DIR, 'LICENSE.md')

    if (fs.existsSync(changelogPath)) fs.unlinkSync(changelogPath)
    if (fs.existsSync(licensePath)) fs.unlinkSync(licensePath)

    // Make binary executable on Unix systems
    if (platform !== 'win32') {
      fs.chmodSync(PB_BINARY_PATH, 0o755)
    }

    CLILoggingService.success(
      `PocketBase v${PB_VERSION} downloaded to ${chalk.bold.blue(PB_BINARY_PATH)}`
    )
  } catch (error) {
    CLILoggingService.error(
      `Failed to download PocketBase: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
    process.exit(1)
  }
}
