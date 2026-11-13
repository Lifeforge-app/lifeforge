import fs from 'node:fs'
import path from 'node:path'

import { run } from './cli'

/** Reads the `repository` URL from a module/locale package.json, if any. */
export function readRepoUrl(packageDir: string): string | undefined {
  try {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(packageDir, 'package.json'), 'utf-8')
    ) as { repository?: string | { url?: string } }

    return typeof pkg.repository === 'string'
      ? pkg.repository
      : pkg.repository?.url
  } catch {
    return undefined
  }
}

/** Parses a GitHub URL (or `owner/repo` slug) into `owner/repo`. */
export function parseRepoSlug(urlOrSlug: string): string | undefined {
  const match = urlOrSlug.match(/github\.com[/:]([^/]+)\/([^/.]+)/)

  if (match) {
    return `${match[1]}/${match[2]}`
  }

  return /^[^/]+\/[^/]+$/.test(urlOrSlug) ? urlOrSlug : undefined
}

/** Resolves a module/locale's `owner/repo` GitHub slug from its package.json. */
export function readRepoSlug(packageDir: string): string | undefined {
  const url = readRepoUrl(packageDir)

  return url ? parseRepoSlug(url) : undefined
}

/** Reads the `owner/repo` GitHub slug from a module/locale package.json. */
export function getRepoSlug(packageDir: string): string {
  const slug = readRepoSlug(packageDir)

  if (!slug) {
    throw new Error(`Cannot determine the GitHub repo for ${packageDir}`)
  }

  return slug
}

/** Resolves a git tag/ref to its commit SHA. */
export function getTagCommit(repo: string, tag: string): string {
  return run(`gh api repos/${repo}/commits/${tag} --jq .sha`)
}
