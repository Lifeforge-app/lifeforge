import { execSync } from 'node:child_process'
import fs, { createWriteStream } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import type { ReadableStream as WebReadableStream } from 'node:stream/web'
import { extract as tarExtract } from 'tar'

/**
 * The GitHub repo that hosts the static module/locale index.
 */
export const REGISTRY_REPO = 'lifeforge-app/registry'

export const REGISTRY_REF = 'main'

/** Runs a shell command synchronously and returns trimmed stdout. */
export function run(command: string, cwd?: string): string {
  return execSync(command, { cwd, encoding: 'utf-8' }).trim()
}

/** Calls the GitHub API via the `gh` CLI and parses the JSON response. */
export function ghApi<T = unknown>(endpoint: string): T {
  return JSON.parse(run(`gh api ${endpoint}`)) as T
}

/** Returns the authenticated GitHub user's login. */
export function getGithubLogin(): string {
  return run('gh api user --jq .login')
}

/** Resolves a git tag/ref to its commit SHA. */
export function getTagCommit(repo: string, tag: string): string {
  return run(`gh api repos/${repo}/commits/${tag} --jq .sha`)
}

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

/** Fetches and parses JSON from a URL. */
export async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`)
  }

  return (await response.json()) as T
}

/** URL of a file in the registry index repo (raw). */
export function rawRegistryUrl(file: string): string {
  return `https://raw.githubusercontent.com/${REGISTRY_REPO}/${REGISTRY_REF}/${file}`
}

/**
 * Downloads a GitHub repo archive at a specific ref (commit SHA) and extracts
 * it into `destDir` (stripping the top-level `<repo>-<ref>/` directory).
 */
export async function downloadArchive(
  repo: string,
  ref: string,
  destDir: string
): Promise<void> {
  const url = `https://github.com/${repo}/archive/${ref}.tar.gz`

  const response = await fetch(url)

  if (!response.ok || !response.body) {
    throw new Error(`Failed to download ${url}: ${response.status}`)
  }

  fs.mkdirSync(destDir, { recursive: true })

  const tarball = path.join(
    os.tmpdir(),
    `forge-${Date.now()}-${Math.random().toString(36).slice(2)}.tar.gz`
  )

  await pipeline(
    Readable.fromWeb(response.body as unknown as WebReadableStream),
    createWriteStream(tarball)
  )

  try {
    await tarExtract({ file: tarball, cwd: destDir, strip: 1 })
  } finally {
    fs.rmSync(tarball, { force: true })
  }
}

/**
 * Adds/updates an entry in the GitHub-hosted index (`modules.json`/`locales.json`)
 * for the published version, mapping it to the release commit SHA.
 */
export function updateRegistryIndex(
  kind: 'modules' | 'locales',
  entry: { id: string; repo: string; version: string; commitSha: string }
): void {
  const file = `${kind}.json`

  const existing = ghApi<{ content: string; sha: string }>(
    `repos/${REGISTRY_REPO}/contents/${file}`
  )

  const list = JSON.parse(
    Buffer.from(existing.content, 'base64').toString('utf-8')
  ) as Array<{
    id: string
    repo: string
    latest: string
    versions: Record<string, string>
  }>

  const index = list.findIndex(item => item.id === entry.id)
  const previous = index >= 0 ? list[index] : undefined

  const merged = {
    id: entry.id,
    repo: entry.repo,
    latest: entry.version,
    versions: {
      ...(previous?.versions ?? {}),
      [entry.version]: entry.commitSha
    }
  }

  if (index >= 0) {
    list[index] = merged
  } else {
    list.push(merged)
  }

  const content = Buffer.from(JSON.stringify(list, null, 2) + '\n').toString(
    'base64'
  )

  const bodyFile = path.join(os.tmpdir(), `forge-index-${Date.now()}.json`)

  fs.writeFileSync(
    bodyFile,
    JSON.stringify({
      message: `chore: index ${kind}/${entry.id}@${entry.version}`,
      content,
      sha: existing.sha
    })
  )

  try {
    run(
      `gh api -X PUT repos/${REGISTRY_REPO}/contents/${file} --input "${bodyFile}"`
    )
  } finally {
    fs.rmSync(bodyFile, { force: true })
  }
}
