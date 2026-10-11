/**
 * Seeds the LifeForge registry index (`modules.json` / `locales.json`) from
 * GitHub repos.
 *
 * For every repo owned by the configured owners, it reads `package.json`:
 * - `@lifeforge/<publisher>--<name>`          -> module entry
 * - `@lifeforge/<publisher>--lang-<code>`     -> locale entry
 *
 * The pinned commit for the current version is the default branch HEAD. (No
 * semver tags exist yet; future `forge modules publish` runs create them.)
 *
 * Usage: node scripts/seed-registry.mjs [outputDir]
 */
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const OWNERS = ['Lifeforge-app', 'melvinchia3636']

/** Ids to keep out of the registry (not maintained by us). */
const EXCLUDE = new Set(['jiahuiiiii--stock'])

const outputDir = process.argv[2] ?? 'registry'

function gh(command) {
  return execSync(`gh ${command}`, { encoding: 'utf-8' }).trim()
}

function listRepos(owner) {
  try {
    return JSON.parse(
      gh(`repo list ${owner} --limit 500 --json name,defaultBranchRef`)
    )
  } catch {
    return []
  }
}

function getPackageJson(slug, branch) {
  try {
    const content = gh(
      `api repos/${slug}/contents/package.json?ref=${branch} --jq .content 2>/dev/null`
    )

    return JSON.parse(Buffer.from(content, 'base64').toString('utf-8'))
  } catch {
    return null
  }
}

function resolveCommit(slug) {
  try {
    return gh(`api repos/${slug}/commits/HEAD --jq .sha 2>/dev/null`)
  } catch {
    return null
  }
}

const modules = []
const locales = []

for (const owner of OWNERS) {
  for (const repo of listRepos(owner)) {
    const slug = `${owner}/${repo.name}`
    const branch = repo.defaultBranchRef?.name ?? 'main'

    const pkg = getPackageJson(slug, branch)

    if (!pkg?.name?.startsWith('@lifeforge/')) {
      continue
    }

    const shortId = pkg.name.replace('@lifeforge/', '')

    if (EXCLUDE.has(shortId)) {
      continue
    }

    const isLocale = /--lang-/.test(shortId)
    const isModule = /^[a-z0-9-_]+--[a-z0-9-_]+$/i.test(shortId)

    if (!isModule && !isLocale) {
      continue
    }

    const commit = resolveCommit(slug)

    if (!commit) {
      console.warn(`Skipping ${slug}: could not resolve a commit`)
      continue
    }

    const entry = {
      id: shortId,
      repo: slug,
      latest: pkg.version,
      versions: { [pkg.version]: commit }
    }

    if (isLocale) {
      locales.push(entry)
    } else {
      modules.push(entry)
    }

    console.log(`${isLocale ? 'locale ' : 'module '} ${shortId} -> ${slug}@${commit.slice(0, 8)}`)
  }
}

modules.sort((a, b) => a.id.localeCompare(b.id))
locales.sort((a, b) => a.id.localeCompare(b.id))

fs.mkdirSync(outputDir, { recursive: true })
fs.writeFileSync(
  path.join(outputDir, 'modules.json'),
  JSON.stringify(modules, null, 2) + '\n'
)
fs.writeFileSync(
  path.join(outputDir, 'locales.json'),
  JSON.stringify(locales, null, 2) + '\n'
)

console.log(`\nWrote ${modules.length} modules, ${locales.length} locales to ${outputDir}/`)
