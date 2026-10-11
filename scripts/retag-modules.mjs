/**
 * Resets every module listed in lifeforge-app/registry to version 0.0.1:
 *  1. sets `version` to 0.0.1 in the repo's package.json (commits it),
 *  2. creates a `v0.0.1` git tag at that commit,
 *  3. rewrites the registry entry (latest + versions -> tag commit).
 *
 * Usage: node scripts/retag-modules.mjs
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
  const file = path.join(os.tmpdir(), `forge-${Date.now()}-${Math.random().toString(36).slice(2)}.json`)

  fs.writeFileSync(file, JSON.stringify(obj))

  return file
}

const registryFile = ghJson(`api repos/${REGISTRY_REPO}/contents/modules.json`)

const modules = JSON.parse(
  Buffer.from(registryFile.content, 'base64').toString('utf-8')
)

let done = 0
let failed = 0

for (const entry of modules) {
  const repo = entry.repo

  try {
    const branch = gh(`api repos/${repo} --jq .default_branch 2>/dev/null`)

    const pj = ghJson(`api repos/${repo}/contents/package.json?ref=${branch}`)

    const pkg = JSON.parse(Buffer.from(pj.content, 'base64').toString('utf-8'))

    let commitSha

    if (pkg.version === VERSION) {
      commitSha = gh(`api repos/${repo}/commits/${branch} --jq .sha`)
    } else {
      pkg.version = VERSION

      const body = writeBody({
        message: `chore: reset version to ${VERSION}`,
        content: Buffer.from(JSON.stringify(pkg, null, 2) + '\n').toString('base64'),
        sha: pj.sha,
        branch
      })

      try {
        const res = ghJson(
          `api --method PUT repos/${repo}/contents/package.json --input "${body}"`
        )

        commitSha = res.commit.sha
      } finally {
        fs.rmSync(body, { force: true })
      }
    }

    const tagBody = writeBody({ ref: `refs/tags/v${VERSION}`, sha: commitSha })

    try {
      gh(`api --method POST repos/${repo}/git/refs --input "${tagBody}" 2>/dev/null`)
    } catch {
      // tag already exists
    } finally {
      fs.rmSync(tagBody, { force: true })
    }

    entry.latest = VERSION
    entry.versions = { [VERSION]: commitSha }

    done++
    console.log(`${entry.id} -> ${repo}@${commitSha.slice(0, 8)}`)
  } catch (error) {
    failed++
    console.error(`FAILED ${entry.id} (${repo}): ${String(error).split('\n')[0]}`)
  }
}

const outputFile = writeBody({
  message: `chore: reset module versions to ${VERSION}`,
  content: Buffer.from(JSON.stringify(modules, null, 2) + '\n').toString('base64'),
  sha: registryFile.sha
})

try {
  gh(`api --method PUT repos/${REGISTRY_REPO}/contents/modules.json --input "${outputFile}"`)
} finally {
  fs.rmSync(outputFile, { force: true })
}

console.log(`\nDone: ${done} modules retagged, ${failed} failed. Registry updated.`)
