import fs from 'fs'
import os from 'os'
import path from 'path'

import { installDeps } from './commands'
import { downloadArchive, readRepoSlug } from './github'
import { assertKebabRepo } from './kebab'
import type { RegistryEntry } from './registryIndex'

interface InstallFromGithubOptions {
  /** Scope-stripped module/locale id (e.g. `lifeforge--wallet`). */
  id: string
  entry: RegistryEntry
  targetDir: string
  version: string
}

/**
 * Installs a module/locale from its GitHub repo: downloads the archive at the
 * index-pinned commit, verifies its identity, and moves it into place.
 *
 * @returns The resolved commit SHA and the archive's declared package name.
 */
export async function installFromGithub({
  id,
  entry,
  targetDir,
  version
}: InstallFromGithubOptions): Promise<{ commitSha: string; name: string }> {
  const commitSha = entry.versions[version]

  if (!commitSha) {
    throw new Error(`No release commit recorded for ${id}@${version}`)
  }

  assertKebabRepo(entry.repo)

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-pkg-'))

  try {
    await downloadArchive(entry.repo, commitSha, tempDir)

    const pkgPath = path.join(tempDir, 'package.json')

    if (!fs.existsSync(pkgPath)) {
      throw new Error(`Archive for ${id}@${version} has no package.json`)
    }

    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as {
      name: string
    }

    const expectedName = `@lifeforge/${id}`

    if (pkg.name !== expectedName) {
      throw new Error(
        `Identity check failed for ${id}: expected ${expectedName}, got ${pkg.name}`
      )
    }

    const slug = readRepoSlug(tempDir)

    if (slug && slug.toLowerCase() !== entry.repo.toLowerCase()) {
      throw new Error(
        `Repository check failed for ${id}: expected ${entry.repo}, got ${slug}`
      )
    }

    fs.rmSync(targetDir, { recursive: true, force: true })
    fs.cpSync(tempDir, targetDir, { recursive: true })

    installDeps()

    return { commitSha, name: pkg.name }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
}
