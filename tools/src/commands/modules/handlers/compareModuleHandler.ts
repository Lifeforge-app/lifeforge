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

function compareFileContent(file1: string, file2: string): boolean {
  if (!fs.existsSync(file1) || !fs.existsSync(file2)) {
    return false
  }

  const content1 = fs.readFileSync(file1)

  const content2 = fs.readFileSync(file2)

  return content1.equals(content2)
}

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

function printDiff(moduleName: string, diff: FileDiff): boolean {
  const hasChanges =
    diff.added.length > 0 || diff.modified.length > 0 || diff.deleted.length > 0

  if (!hasChanges) {
    Logging.success(`${Logging.highlight(moduleName)} is in sync with registry`)

    return false
  }

  Logging.warn(`${Logging.highlight(moduleName)} has differences:`)

  if (diff.added.length > 0) {
    Logging.print(
      Logging.green(`  + ${diff.added.length} file(s) added locally:`)
    )

    for (const file of diff.added.slice(0, 10)) {
      Logging.print(Logging.dim(`      ${file}`))
    }

    if (diff.added.length > 10) {
      Logging.print(Logging.dim(`      ... and ${diff.added.length - 10} more`))
    }
  }

  if (diff.modified.length > 0) {
    Logging.print(
      Logging.yellow(`  ~ ${diff.modified.length} file(s) modified:`)
    )

    for (const file of diff.modified.slice(0, 10)) {
      Logging.print(Logging.dim(`      ${file}`))
    }

    if (diff.modified.length > 10) {
      Logging.print(
        Logging.dim(`      ... and ${diff.modified.length - 10} more`)
      )
    }
  }

  if (diff.deleted.length > 0) {
    Logging.print(
      Logging.red(`  - ${diff.deleted.length} file(s) deleted locally:`)
    )

    for (const file of diff.deleted.slice(0, 10)) {
      Logging.print(Logging.dim(`      ${file}`))
    }

    if (diff.deleted.length > 10) {
      Logging.print(
        Logging.dim(`      ... and ${diff.deleted.length - 10} more`)
      )
    }
  }

  return true
}

async function compareModule(packageName: string): Promise<boolean | null> {
  const { fullName, shortName, targetDir } = normalizePackage(packageName)

  if (!fs.existsSync(targetDir)) {
    Logging.actionableError(
      `Module "${shortName}" not found locally`,
      'Run "bun forge modules list" to see installed modules'
    )

    return null
  }

  if (!(await checkPackageExists(fullName))) {
    Logging.warn(
      `${Logging.highlight(fullName)} is not published to the registry`
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

export async function compareModuleHandler(moduleName?: string): Promise<void> {
  if (moduleName) {
    await compareModule(moduleName)

    return
  }

  const modules = listModules()

  if (Object.keys(modules).length === 0) {
    Logging.info('No modules found to compare')

    return
  }

  Logging.info(
    `Comparing ${Object.keys(modules).length} module(s) with registry...`
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
    Logging.warn(`${changedCount} module(s) have local changes`)
  }
}
