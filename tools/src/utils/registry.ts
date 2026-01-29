import fs from 'fs'
import path from 'path'

import { ROOT_DIR } from '@/constants/constants'
import logger from '@/utils/logger'

import executeCommand from './commands'

/**
 * Gets the registry URL for the @lifeforge scope from bunfig.toml.
 *
 * @returns The registry URL, or the default registry if not configured
 */
export function getRegistryUrl(): string {
  const bunfigPath = path.join(ROOT_DIR, 'bunfig.toml')

  if (fs.existsSync(bunfigPath)) {
    const content = fs.readFileSync(bunfigPath, 'utf-8')

    const match = content.match(/"@lifeforge"\s*=\s*"([^"]+)"/)

    if (match) {
      return match[1]
    }
  }

  return 'https://registry.lifeforge.dev/'
}

/**
 * Checks if a package exists in the registry.
 *
 * @param packageName - The full package name to check
 * @returns True if the package exists, false otherwise
 */
export async function checkPackageExists(
  packageName: string
): Promise<boolean> {
  const registry = getRegistryUrl()

  try {
    executeCommand(`npm view ${packageName} --registry ${registry}`, {
      cwd: ROOT_DIR,
      exitOnError: false
    })

    return true
  } catch {
    return false
  }
}

/**
 * Checks if the user is authenticated with the registry.
 *
 * @returns An object with authentication status and username if authenticated
 * @throws Exits the process if not authenticated
 */
export async function checkAuth(): Promise<{
  authenticated: boolean
  username?: string
}> {
  const registry = getRegistryUrl()

  try {
    const result = executeCommand(
      `npm whoami --registry ${registry} 2>/dev/null`,
      {
        cwd: ROOT_DIR,
        exitOnError: false
      }
    )

    const username = result?.toString().trim()

    if (username) {
      return { authenticated: true, username }
    }

    throw new Error('Not authenticated')
  } catch {
    logger.warn('Not authenticated. Please login first.')

    process.exit(1)
  }
}

interface PackageMetadata {
  'dist-tags'?: { latest?: string }
  versions?: Record<string, { dist?: { tarball?: string } }>
}

/**
 * Fetches package metadata from the registry.
 *
 * @param packageName - The full package name to fetch metadata for
 * @returns The package metadata, or null if not found
 */
async function getPackageMetadata(
  packageName: string
): Promise<PackageMetadata | null> {
  const registry = getRegistryUrl()

  try {
    const targetURL = new URL(registry)

    targetURL.pathname = packageName

    const response = await fetch(targetURL.toString())

    if (!response.ok) {
      return null
    }

    return (await response.json()) as PackageMetadata
  } catch {
    return null
  }
}

/**
 * Gets the latest version of a package from the registry.
 *
 * @param packageName - The full package name to check
 * @returns The latest version string, or null if not found
 */
export async function getPackageLatestVersion(
  packageName: string
): Promise<string | null> {
  const metadata = await getPackageMetadata(packageName)

  return metadata?.['dist-tags']?.latest || null
}

/**
 * Gets the tarball URL for the latest version of a package.
 *
 * @param packageName - The full package name
 * @returns The tarball URL, or null if not found
 */
export async function getPackageTarballUrl(
  packageName: string
): Promise<string | null> {
  const metadata = await getPackageMetadata(packageName)

  const latestVersion = metadata?.['dist-tags']?.latest

  if (!latestVersion) {
    return null
  }

  return metadata?.versions?.[latestVersion]?.dist?.tarball || null
}
