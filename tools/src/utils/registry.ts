import fs from 'fs'
import path from 'path'

import { executeCommand } from '@/utils/helpers'
import CLILoggingService from '@/utils/logging'

export function getRegistryUrl(): string {
  const bunfigPath = path.join(process.cwd(), 'bunfig.toml')

  if (fs.existsSync(bunfigPath)) {
    const content = fs.readFileSync(bunfigPath, 'utf-8')

    const match = content.match(/"@lifeforge"\s*=\s*"([^"]+)"/)

    if (match) {
      return match[1]
    }
  }

  return 'https://registry.lifeforge.dev/'
}

export async function checkPackageExists(
  packageName: string
): Promise<boolean> {
  const registry = getRegistryUrl()

  try {
    executeCommand(`npm view ${packageName} --registry ${registry}`, {
      cwd: process.cwd(),
      stdio: 'pipe'
    })

    return true
  } catch {
    return false
  }
}

export async function checkAuth(): Promise<{
  authenticated: boolean
  username?: string
}> {
  const registry = getRegistryUrl()

  try {
    const result = executeCommand(
      `npm whoami --registry ${registry} 2>/dev/null`,
      {
        cwd: process.cwd(),
        stdio: 'pipe'
      }
    )

    const username = result?.toString().trim()

    if (username) {
      return { authenticated: true, username }
    }

    throw new Error('Not authenticated')
  } catch {
    CLILoggingService.warn('Not authenticated. Please login first.')
    openRegistryLogin()

    process.exit(1)
  }
}

export function openRegistryLogin(): void {
  const registry = getRegistryUrl()

  const loginUrl = registry.replace(/\/$/, '')

  executeCommand(`open "${loginUrl}"`, {
    cwd: process.cwd(),
    stdio: 'ignore'
  })
}
