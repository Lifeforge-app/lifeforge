import { log } from '@clack/prompts'
import chalk from 'chalk'
import fs from 'fs'
import os from 'os'
import path from 'path'

import { downloadArchive } from '@/utils/github'
import normalizePackage from '@/utils/normalizePackage'
import { resolveEntry } from '@/utils/registryIndex'
import { failSpinner, startSpinner, stopSpinner } from '@/utils/spinner'

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
 * Compares local and remote directories to find differences.
 */
function compareDirectories(localDir: string, remoteDir: string): FileDiff {
  const localFiles = new Set(getAllFiles(localDir))

  const remoteFiles = new Set(getAllFiles(remoteDir))

  const added: string[] = []

  const modified: string[] = []

  const deleted: string[] = []

  for (const file of localFiles) {
    if (!remoteFiles.has(file)) {
      added.push(file)
    } else {
      const localPath = path.join(localDir, file)

      const remotePath = path.join(remoteDir, file)

      if (!compareFileContent(localPath, remotePath)) {
        modified.push(file)
      }
    }
  }

  for (const file of remoteFiles) {
    if (!localFiles.has(file)) {
      deleted.push(file)
    }
  }

  return { added, modified, deleted }
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
    log.message(
      `  ${chalk.green('✓')} ${chalk.blue(moduleName)} ${chalk.dim('is in sync')}`
    )

    return false
  }

  log.message(`  ${chalk.yellow('!')} ${chalk.blue(moduleName)}`)

  if (diff.added.length > 0) {
    log.message(chalk.green(`      + ${diff.added.length} added locally`))

    for (const file of diff.added.slice(0, 5)) {
      log.message(chalk.dim(`        ${file}`))
    }

    if (diff.added.length > 5) {
      log.message(chalk.dim(`        ... and ${diff.added.length - 5} more`))
    }
  }

  if (diff.modified.length > 0) {
    log.message(chalk.yellow(`      ~ ${diff.modified.length} modified`))

    for (const file of diff.modified.slice(0, 5)) {
      log.message(chalk.dim(`        ${file}`))
    }

    if (diff.modified.length > 5) {
      log.message(
        chalk.dim(`        ... and ${diff.modified.length - 5} more`)
      )
    }
  }

  if (diff.deleted.length > 0) {
    log.message(chalk.red(`      - ${diff.deleted.length} deleted locally`))

    for (const file of diff.deleted.slice(0, 5)) {
      log.message(chalk.dim(`        ${file}`))
    }

    if (diff.deleted.length > 5) {
      log.message(chalk.dim(`        ... and ${diff.deleted.length - 5} more`))
    }
  }

  return true
}

/**
 * Compares a single module against its published (registry) version.
 *
 * @returns true if has changes, false if in sync, null if comparison failed
 */
async function compareModule(packageName: string): Promise<boolean | null> {
  const { shortName, targetDir } = normalizePackage(packageName)

  if (!fs.existsSync(targetDir)) {
    log.error(`Module ${chalk.blue(shortName)} is not installed`)

    return null
  }

  const entry = await resolveEntry('modules', shortName)

  if (!entry) {
    log.message(
      `  ${chalk.dim('○')} ${chalk.blue(shortName)} ${chalk.dim('(not published)')}`
    )

    return null
  }

  const commitSha = entry.versions[entry.latest]

  if (!commitSha) {
    log.warn(`Could not resolve release commit for ${chalk.blue(shortName)}`)

    return null
  }

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'forge-compare-'))

  startSpinner(`Downloading ${chalk.blue(shortName)} from the registry...`)

  try {
    await downloadArchive(entry.repo, commitSha, tempDir)

    stopSpinner()

    const diff = compareDirectories(targetDir, tempDir)

    return printDiff(shortName, diff)
  } catch (error) {
    failSpinner(`Failed to compare ${chalk.blue(shortName)}`)

    throw error
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
}

/**
 * Compares one or all modules against their published versions.
 *
 * Shows which files have been added, modified, or deleted locally
 * compared to the published version in the registry.
 */
export async function compareModuleHandler(moduleName?: string): Promise<void> {
  if (moduleName) {
    log.message('')
    await compareModule(moduleName)
    log.message('')

    return
  }

  const modules = listModules()

  if (Object.keys(modules).length === 0) {
    log.message('No modules installed')

    return
  }

  log.message(
    `\nComparing ${chalk.blue(String(Object.keys(modules).length))} modules with the registry...\n`
  )

  let changedCount = 0

  for (const name of Object.keys(modules)) {
    const hasChanges = await compareModule(name)

    if (hasChanges) {
      changedCount++
    }
  }

  log.message('')

  if (changedCount === 0) {
    log.success('All modules are in sync with the registry')
  } else {
    log.warn(
      `${chalk.blue(String(changedCount))} module${changedCount > 1 ? 's' : ''} have local changes`
    )
  }
}
