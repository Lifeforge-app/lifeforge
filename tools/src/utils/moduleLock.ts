import { log } from '@clack/prompts'
import fs from 'fs'
import path from 'path'

import { ROOT_DIR } from '@/constants/constants'

export type LockKind = 'modules' | 'locales'

export interface LockEntry {
  repo: string
  version: string
  commitSha: string
}

interface LockFile {
  modules: Record<string, LockEntry>
  locales: Record<string, LockEntry>
}

const LOCK_PATH = path.join(ROOT_DIR, 'modules-lock.json')

function readLock(): LockFile {
  if (!fs.existsSync(LOCK_PATH)) {
    return { modules: {}, locales: {} }
  }

  const parsed = JSON.parse(
    fs.readFileSync(LOCK_PATH, 'utf-8')
  ) as Partial<LockFile>

  return {
    modules: parsed.modules ?? {},
    locales: parsed.locales ?? {}
  }
}

function writeLock(lock: LockFile): void {
  fs.writeFileSync(LOCK_PATH, JSON.stringify(lock, null, 2) + '\n')
}

export function getLocked(kind: LockKind, id: string): LockEntry | undefined {
  return readLock()[kind][id]
}

export function setLocked(kind: LockKind, id: string, entry: LockEntry): void {
  const lock = readLock()

  lock[kind][id] = entry
  writeLock(lock)
}

export function removeLocked(kind: LockKind, id: string): void {
  const lock = readLock()

  delete lock[kind][id]
  writeLock(lock)
}

/**
 * Verifies the index-pinned commit against the lockfile. If the same version was
 * previously locked to a different commit, the source has been tampered with
 * (or a tag was moved) — abort. First-time versions are trust-on-first-use.
 */
export function verifyLocked(
  kind: LockKind,
  id: string,
  version: string,
  commitSha: string
): void {
  const locked = getLocked(kind, id)

  if (locked && locked.version === version && locked.commitSha !== commitSha) {
    log.error(
      `Integrity check failed for ${id}@${version}: lockfile pins ${locked.commitSha}, registry has ${commitSha}`
    )

    process.exit(1)
  }
}
