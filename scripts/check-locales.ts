import fs from 'node:fs'
import path from 'node:path'

const LOCALES_DIR = path.resolve(import.meta.dirname, '..', 'locales')
const REF_LANG = 'lang-en'

function flattenKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = []

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...flattenKeys(value as Record<string, unknown>, fullKey))
    } else {
      keys.push(fullKey)
    }
  }

  return keys
}

function readJSON(filePath: string): Record<string, unknown> | null {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  } catch {
    return null
  }
}

const refDir = path.join(LOCALES_DIR, REF_LANG)

if (!fs.existsSync(refDir)) {
  console.error(`Reference language directory not found: ${refDir}`)
  process.exit(1)
}

const langDirs = fs
  .readdirSync(LOCALES_DIR)
  .filter(d => d.startsWith('lang-') && d !== REF_LANG)

let totalMissing = 0
let totalExtra = 0

for (const file of fs.readdirSync(refDir)) {
  if (!file.endsWith('.json')) continue

  const refPath = path.join(refDir, file)
  const refData = readJSON(refPath)

  if (!refData) {
    console.warn(`[WARN] Could not read ${refPath}`)
    continue
  }

  const refKeys = new Set(flattenKeys(refData))

  for (const langDir of langDirs) {
    const targetPath = path.join(LOCALES_DIR, langDir, file)

    if (!fs.existsSync(targetPath)) {
      console.log(`[MISSING FILE] ${langDir}/${file}`)
      continue
    }

    const targetData = readJSON(targetPath)

    if (!targetData) {
      console.warn(`[WARN] Could not read ${targetPath}`)
      continue
    }

    const targetKeys = new Set(flattenKeys(targetData))

    const missing: string[] = []

    for (const key of refKeys) {
      if (!targetKeys.has(key)) {
        missing.push(key)
      }
    }

    const extra: string[] = []

    for (const key of targetKeys) {
      if (!refKeys.has(key)) {
        extra.push(key)
      }
    }

    if (missing.length > 0) {
      console.log(`\n${langDir}/${file} — ${missing.length} missing key(s):`)

      for (const key of missing) {
        console.log(`  - ${key}`)
      }
      totalMissing += missing.length
    }

    if (extra.length > 0) {
      console.log(`\n${langDir}/${file} — ${extra.length} extra key(s):`)

      for (const key of extra) {
        console.log(`  + ${key}`)
      }
      totalExtra += extra.length
    }
  }
}

if (totalMissing === 0 && totalExtra === 0) {
  console.log('\nAll language packs are complete.')
} else {
  if (totalMissing > 0) {
    console.log(`\n${totalMissing} total missing key(s) across all languages.`)
  }

  if (totalExtra > 0) {
    console.log(`${totalExtra} total extra key(s) across all languages.`)
  }
  process.exit(1)
}
