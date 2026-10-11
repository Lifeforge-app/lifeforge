import { describe, expect, it } from 'vitest'

import type { ModuleEntry } from '@lifeforge/configs'

import { ModuleRegistry } from './ModuleRegistry'

const entry = (name: string): ModuleEntry => ({ name }) as ModuleEntry

describe('ModuleRegistry path resolution', () => {
  it('resolves the module id only at a directory boundary', () => {
    ModuleRegistry.register(
      entry('@lifeforge/lifeforge--foo'),
      '/repo/modules/foo'
    )
    ModuleRegistry.register(
      entry('@lifeforge/lifeforge--foo-bar'),
      '/repo/modules/foo-bar'
    )

    expect(
      ModuleRegistry.getModuleIdByPath('/repo/modules/foo-bar/server/index.ts')
    ).toBe('@lifeforge/lifeforge--foo-bar')

    expect(
      ModuleRegistry.getModuleIdByPath('/repo/modules/foo/server/index.ts')
    ).toBe('@lifeforge/lifeforge--foo')
  })

  it('returns undefined for paths outside any module', () => {
    expect(
      ModuleRegistry.getModuleIdByPath('/repo/packages/drizzle/src/index.ts')
    ).toBeUndefined()
  })

  it('maps a module id back to its path', () => {
    ModuleRegistry.register(
      entry('@lifeforge/lifeforge--bar'),
      '/repo/modules/bar'
    )

    expect(ModuleRegistry.getPath('lifeforge--bar')).toBe('/repo/modules/bar')
  })
})
