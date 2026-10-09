import fs from 'fs'
import os from 'os'
import path from 'path'
import { afterEach, describe, expect, it } from 'vitest'

import {
  deriveModuleNamespace,
  resolveCallerModuleId,
  resolveModuleId
} from './moduleNamespace'
import { ModuleRegistry } from './registry/ModuleRegistry'

const tempRoots: string[] = []

/** Creates a temp `.../modules/<folderName>` dir, optionally with a package.json. */
function createModuleDir(folderName: string, packageName?: string): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'module-registry-'))

  tempRoots.push(root)

  const moduleDir = path.join(root, 'modules', folderName)

  fs.mkdirSync(moduleDir, { recursive: true })

  if (packageName !== undefined) {
    fs.writeFileSync(
      path.join(moduleDir, 'package.json'),
      JSON.stringify({ name: packageName })
    )
  }

  return moduleDir
}

afterEach(() => {
  for (const root of tempRoots) {
    fs.rmSync(root, { recursive: true, force: true })
  }

  tempRoots.length = 0
})

describe('deriveModuleNamespace', () => {
  it('strips the npm scope before deriving', () => {
    expect(deriveModuleNamespace('@lifeforge/lifeforge--achievements')).toBe(
      'achievements'
    )
    expect(deriveModuleNamespace('@lifeforge/lifeforge--calendar')).toBe(
      'calendar'
    )
    expect(deriveModuleNamespace('@lifeforge/lifeforge--owntracks')).toBe(
      'owntracks'
    )
  })

  it('prefixes non-official authors with a triple underscore', () => {
    expect(
      deriveModuleNamespace('@lifeforge/melvinchia3636--ets2-record')
    ).toBe('melvinchia3636___ets_2_record')
    expect(deriveModuleNamespace('melvinchia3636--invoice-maker')).toBe(
      'melvinchia3636___invoice_maker'
    )
  })

  it('handles unscoped ids', () => {
    expect(deriveModuleNamespace('lifeforge--app')).toBe('app')
    expect(deriveModuleNamespace('dashboard')).toBe('dashboard')
  })
})

describe('resolveModuleId', () => {
  it('derives the namespace from package.json, not the folder name', () => {
    const moduleDir = createModuleDir(
      'some-unrelated-folder',
      '@lifeforge/lifeforge--calendar'
    )

    const moduleId = resolveModuleId(moduleDir)

    expect(moduleId).toBe('@lifeforge/lifeforge--calendar')
    expect(moduleId && deriveModuleNamespace(moduleId)).toBe('calendar')
  })

  it('reads non-official publishers from package.json', () => {
    const moduleId = resolveModuleId(
      createModuleDir(
        'another-folder',
        '@lifeforge/melvinchia3636--ets2-record'
      )
    )

    expect(moduleId && deriveModuleNamespace(moduleId)).toBe(
      'melvinchia3636___ets_2_record'
    )
  })

  it('prefers a registered module id over package.json', () => {
    const moduleDir = createModuleDir(
      'registered-folder',
      '@lifeforge/lifeforge--from-package'
    )

    ModuleRegistry.registerPath(
      moduleDir,
      '@lifeforge/lifeforge--from-registry'
    )

    expect(resolveModuleId(moduleDir)).toBe(
      '@lifeforge/lifeforge--from-registry'
    )
  })

  it('returns undefined when there is no package.json', () => {
    expect(resolveModuleId(createModuleDir('empty-folder'))).toBeUndefined()
  })
})

describe('resolveCallerModuleId', () => {
  it('resolves the id from the module directory in the stack', () => {
    const moduleDir = createModuleDir(
      'folder-name-means-nothing',
      '@lifeforge/lifeforge--calendar'
    )

    const stack = `Error\n    at probe (${path.join(moduleDir, 'probe.ts')}:1:1)`

    const moduleId = resolveCallerModuleId(stack)

    expect(moduleId).toBe('@lifeforge/lifeforge--calendar')
    expect(moduleId && deriveModuleNamespace(moduleId)).toBe('calendar')
  })

  it('returns undefined when the stack is not inside a module', () => {
    const stack = 'Error\n    at foo (/repo/packages/drizzle/src/index.ts:1:1)'

    expect(resolveCallerModuleId(stack)).toBeUndefined()
  })
})
