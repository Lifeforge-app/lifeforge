import fs from 'fs'
import os from 'os'
import path from 'path'
import { Readable } from 'stream'
import { pipeline } from 'stream/promises'
import { extract } from 'tar'
import { createGunzip } from 'zlib'

import Logging from '@/utils/logging'
import normalizePackage from '@/utils/normalizePackage'
import { checkPackageExists, getPackageTarballUrl } from '@/utils/registry'

import listModules from '../functions/listModules'

interface FileDiff {
  added: string[]
  modified: string[]
  deleted: string[]
}

/**
 * Recursively gets all file paths in a directory.
 * Excludes node_modules and .git directories.
 */
function getAllFiles(dir: string, baseDir: string = dir): string[] {
  const files: string[] = []

  if (!fs.existsSync(dir)) {
    return files
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    const relativePath = path.relative(baseDir, fullPath)

    if (entry.name === 'node_modules' || entry.name === '.git') {
      continue
    }

    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, baseDir))
    } else {
      files.push(relativePath)
    }
  }

  return files
}

/**
 * Compares two files by content using Buffer.equals.
 */
function compareFileContent(file1: string, file2: string): boolean {
  if (!fs.existsSync(file1) || !fs.existsSync(file2)) {
    return false
  }

  const content1 = fs.readFileSync(file1)

  const content2 = fs.readFileSync(file2)

  return content1.equals(content2)
}

/**
 * Compares local and registry directories to find differences.
 */
function compareDirectories(localDir: string, registryDir: string): FileDiff {
  const localFiles = new Set(getAllFiles(localDir))

  const registryFiles = new Set(getAllFiles(registryDir))

  const added: string[] = []

  const modified: string[] = []

  const deleted: string[] = []

  for (const file of localFiles) {
    if (!registryFiles.has(file)) {
      added.push(file)
    } else {
      const localPath = path.join(localDir, file)

      const registryPath = path.join(registryDir, file)

      if (!compareFileContent(localPath, registryPath)) {
        modified.push(file)
      }
    }
  }

  for (const file of registryFiles) {
    if (!localFiles.has(file)) {
      deleted.push(file)
    }
  }

  return { added, modified, deleted }
}

/**
 * Downloads and extracts an npm package tarball.
 */
async function downloadAndExtractTarball(
  tarballUrl: string,
  extractDir: string
): Promise<void> {
  const response = await fetch(tarballUrl)

  if (!response.ok || !response.body) {
    throw new Error(`Failed to download tarball: ${response.statusText}`)
  }

  fs.mkdirSync(extractDir, { recursive: true })

  const nodeStream = Readable.fromWeb(
    response.body as Parameters<typeof Readable.fromWeb>[0]
  )

  await pipeline(nodeStream, createGunzip(), extract({ cwd: extractDir }))
}

/**
 * Prints file differences in a formatted way.
 *
 * @returns true if there were differences, false if in sync
 */
function printDiff(moduleName: string, diff: FileDiff): boolean {
  const hasChanges =
    diff.added.length > 0 || diff.modified.length > 0 || diff.deleted.length > 0

  if (!hasChanges) {
    Logging.print(
      `  ${Logging.green('✓')} ${Logging.highlight(moduleName)} ${Logging.dim('is in sync')}`
    )

    return false
  }

  Logging.print(`  ${Logging.yellow('!')} ${Logging.highlight(moduleName)}`)

  if (diff.added.length > 0) {
    Logging.print(Logging.green(`      + ${diff.added.length} added locally`))

    for (const file of diff.added.slice(0, 5)) {
      Logging.print(Logging.dim(`        ${file}`))
    }

    if (diff.added.length > 5) {
      Logging.print(
        Logging.dim(`        ... and ${diff.added.length - 5} more`)
      )
    }
  }

  if (diff.modified.length > 0) {
    Logging.print(Logging.yellow(`      ~ ${diff.modified.length} modified`))

    for (const file of diff.modified.slice(0, 5)) {
      Logging.print(Logging.dim(`        ${file}`))
    }

    if (diff.modified.length > 5) {
      Logging.print(
        Logging.dim(`        ... and ${diff.modified.length - 5} more`)
      )
    }
  }

  if (diff.deleted.length > 0) {
    Logging.print(Logging.red(`      - ${diff.deleted.length} deleted locally`))

    for (const file of diff.deleted.slice(0, 5)) {
      Logging.print(Logging.dim(`        ${file}`))
    }

    if (diff.deleted.length > 5) {
      Logging.print(
        Logging.dim(`        ... and ${diff.deleted.length - 5} more`)
      )
    }
  }

  return true
}

/**
 * Compares a single module against its registry version.
 *
 * @returns true if has changes, false if in sync, null if comparison failed
 */
async function compareModule(packageName: string): Promise<boolean | null> {
  const { fullName, shortName, targetDir } = normalizePackage(packageName)

  if (!fs.existsSync(targetDir)) {
    Logging.actionableError(
      `Module ${Logging.highlight(shortName)} is not installed`,
      'Run "bun forge modules list" to see installed modules'
    )

    return null
  }

  if (!(await checkPackageExists(fullName))) {
    Logging.print(
      `  ${Logging.dim('○')} ${Logging.highlight(shortName)} ${Logging.dim('(not published)')}`
    )

    return null
  }

  const tarballUrl = await getPackageTarballUrl(fullName)

  if (!tarballUrl) {
    Logging.warn(`Could not get tarball URL for ${Logging.highlight(fullName)}`)

    return null
  }

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-compare-'))

  try {
    Logging.debug(`Downloading ${Logging.highlight(fullName)} from registry...`)

    await downloadAndExtractTarball(tarballUrl, tempDir)

    const extractedDir = path.join(tempDir, 'package')

    if (!fs.existsSync(extractedDir)) {
      throw new Error('Extracted tarball does not contain a package directory')
    }

    const diff = compareDirectories(targetDir, extractedDir)

    return printDiff(shortName, diff)
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
}

/**
 * Compares one or all modules against their registry versions.
 *
 * Shows which files have been added, modified, or deleted locally
 * compared to the published version in the registry.
 */
export async function compareModuleHandler(moduleName?: string): Promise<void> {
  if (moduleName) {
    Logging.print('')
    await compareModule(moduleName)
    Logging.print('')

    return
  }

  const modules = listModules()

  if (Object.keys(modules).length === 0) {
    Logging.print('No modules installed')

    return
  }

  Logging.print(
    `\nComparing ${Logging.highlight(String(Object.keys(modules).length))} modules with registry...\n`
  )

  let changedCount = 0

  for (const name of Object.keys(modules)) {
    const hasChanges = await compareModule(name)

    if (hasChanges) {
      changedCount++
    }
  }

  Logging.print('')

  if (changedCount === 0) {
    Logging.success('All modules are in sync with the registry')
  } else {
    Logging.warn(
      `${Logging.highlight(String(changedCount))} module${changedCount > 1 ? 's' : ''} have local changes`
    )
  }
}
