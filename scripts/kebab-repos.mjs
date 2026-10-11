/**
 * Renames every non-kebab-case module repo in lifeforge-app/registry to
 * dash-case, updates its package.json repository URL, re-points the v0.0.1 tag
 * to the updated commit, and rewrites the registry entries.
 *
 * Usage: node scripts/kebab-repos.mjs
 */
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const REGISTRY_REPO = 'Lifeforge-app/registry'
const VERSION = '0.0.1'

function gh(command) {
  return execSync(`gh ${command}`, { encoding: 'utf-8' }).trim()
}

function ghJson(command) {
  return JSON.parse(gh(command))
}

function writeBody(obj) {
  const file = path.join(
    os.tmpdir(),
    `forge-${Date.now()}-${Math.random().toString(36).slice(2)}.json`
  )

  fs.writeFileSync(file, JSON.stringify(obj))

  return file
}

function toKebab(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase()
}

const registryFile = ghJson(`api repos/${REGISTRY_REPO}/contents/modules.json`)

const modules = JSON.parse(
  Buffer.from(registryFile.content, 'base64').toString('utf-8')
)

let renamed = 0

for (const entry of modules) {
  const [owner, name] = entry.repo.split('/')

  const kebab = toKebab(name)

  if (kebab === name) {
    continue
  }

  const newSlug = `${owner}/${kebab}`

  gh(`repo rename -R ${entry.repo} ${kebab} -y`)

  // Update repository.url + re-point the tag to the updated commit.
  const pj = ghJson(`api repos/${newSlug}/contents/package.json`)

  const pkg = JSON.parse(Buffer.from(pj.content, 'base64').toString('utf-8'))

  pkg.repository = { type: 'git', url: `https://github.com/${newSlug}.git` }

  const putBody = writeBody({
    message: 'chore: use dash-case repository name',
    content: Buffer.from(JSON.stringify(pkg, null, 2) + '\n').toString('base64'),
    sha: pj.sha
  })

  let commitSha

  try {
    const res = ghJson(
      `api --method PUT repos/${newSlug}/contents/package.json --input "${putBody}"`
    )

    commitSha = res.commit.sha
  } finally {
    fs.rmSync(putBody, { force: true })
  }

  const tagBody = writeBody({
    sha: commitSha,
    force: true
  })

  try {
    gh(
      `api --method PATCH repos/${newSlug}/git/refs/tags/v${VERSION} --input "${tagBody}"`
    )
  } finally {
    fs.rmSync(tagBody, { force: true })
  }

  entry.repo = newSlug
  entry.versions = { [VERSION]: commitSha }

  renamed++
  console.log(`${name} -> ${kebab}@${commitSha.slice(0, 8)}`)
}

const outputFile = writeBody({
  message: 'chore: dash-case repository names',
  content: Buffer.from(JSON.stringify(modules, null, 2) + '\n').toString('base64'),
  sha: registryFile.sha
})

try {
  gh(`api --method PUT repos/${REGISTRY_REPO}/contents/modules.json --input "${outputFile}"`)
} finally {
  fs.rmSync(outputFile, { force: true })
}

console.log(`\nRenamed ${renamed} repos. Registry updated.`)
