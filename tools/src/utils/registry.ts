import fs from 'fs'
import path from 'path'

import { ROOT_DIR } from '@/constants/constants'
import logger from '@/utils/logger'

import { getEnvVar } from './helpers'

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
    const targetURL = new URL(registry)

    targetURL.pathname = packageName

    const response = await fetch(targetURL.toString())

    return response.ok
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

  const token = getEnvVar('FORGISTRY_AUTH_TOKEN')

  try {
    const targetURL = new URL(registry)

    targetURL.pathname = '/-/whoami'

    const response = await fetch(targetURL.toString(), {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('Not authenticated')
    }

    const data = (await response.json()) as { username?: string }

    if (data.username) {
      return { authenticated: true, username: data.username }
    }

    throw new Error('Not authenticated')
  } catch {
    logger.error('Not authenticated. Please login first.')
    process.exit(1)
  }
}

export interface PackageVersionData {
  displayName?: string
  description?: string
  author?: string | { name?: string }
  license?: string
  homepage?: string
  repository?: { url?: string } | string
  dependencies?: Record<string, string>
  dist?: { tarball?: string }
}

export interface PackageMetadata {
  name?: string
  'dist-tags'?: { latest?: string }
  versions?: Record<string, PackageVersionData>
}

/**
 * Fetches package metadata from the registry.
 *
 * @param packageName - The full package name to fetch metadata for
 * @returns The package metadata, or null if not found
 */
export async function getPackageMetadata(
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
