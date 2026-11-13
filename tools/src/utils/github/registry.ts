import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { ghApi, run } from './cli'

/**
 * The GitHub repo that hosts the static module/locale index.
 */
export const REGISTRY_REPO = 'lifeforge-app/registry'

export const REGISTRY_REF = 'main'

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
