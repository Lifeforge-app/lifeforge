import fs from 'node:fs'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { clientAliasResolver } from '../resolvers/client-alias-resolver'

vi.mock('node:fs', () => {
  return {
    default: {
      existsSync: vi.fn()
    }
  }
})

describe('clientAliasResolver', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('returns null if importer is not defined', () => {
    expect(clientAliasResolver('@/components/Button', undefined)).toBeNull()
  })

  it('returns null if rootDir cannot be determined', () => {
    expect(clientAliasResolver('@/components/Button', '/outside/project/file.ts')).toBeNull()
  })

  it('resolves "@/manifest" relative to client root directory', () => {
    vi.mocked(fs.existsSync).mockImplementation((pathToCheck) => {
      return pathToCheck === '/Users/project/modules/mrt-builder/client/manifest.ts'
    })

    const result = clientAliasResolver(
      '@/manifest',
      '/Users/project/modules/mrt-builder/client/src/index.tsx'
    )

    expect(result).toBe('/Users/project/modules/mrt-builder/client/manifest.ts')
    expect(fs.existsSync).toHaveBeenCalled()
  })

  it('resolves components relative to client "src" directory', () => {
    vi.mocked(fs.existsSync).mockImplementation((pathToCheck) => {
      return pathToCheck === '/Users/project/modules/mrt-builder/client/src/components/Button.tsx'
    })

    const result = clientAliasResolver(
      '@/components/Button',
      '/Users/project/modules/mrt-builder/client/src/index.tsx'
    )

    expect(result).toBe('/Users/project/modules/mrt-builder/client/src/components/Button.tsx')
  })

  it('resolves index files if no file extension is specified', () => {
    vi.mocked(fs.existsSync).mockImplementation((pathToCheck) => {
      return pathToCheck === '/Users/project/modules/mrt-builder/client/src/components/Layout/index.tsx'
    })

    const result = clientAliasResolver(
      '@/components/Layout',
      '/Users/project/modules/mrt-builder/client/src/index.tsx'
    )

    expect(result).toBe('/Users/project/modules/mrt-builder/client/src/components/Layout/index.tsx')
  })

  it('resolves using standard package "src" directories', () => {
    vi.mocked(fs.existsSync).mockImplementation((pathToCheck) => {
      return pathToCheck === '/Users/project/packages/core/src/utils/math.ts'
    })

    const result = clientAliasResolver(
      '@/utils/math',
      '/Users/project/packages/core/src/index.ts'
    )

    expect(result).toBe('/Users/project/packages/core/src/utils/math.ts')
  })

  it('handles "@fs" prefix and normalizes paths', () => {
    vi.mocked(fs.existsSync).mockImplementation((pathToCheck) => {
      return pathToCheck === '/Users/project/modules/mrt-builder/client/src/utils.ts'
    })

    const result = clientAliasResolver(
      '@/utils',
      '/@fs/Users/project/modules/mrt-builder/client/src/index.tsx'
    )

    expect(result).toBe('/Users/project/modules/mrt-builder/client/src/utils.ts')
  })

  it('resolves base import "@" correctly', () => {
    vi.mocked(fs.existsSync).mockImplementation((pathToCheck) => {
      return pathToCheck === '/Users/project/modules/mrt-builder/client/src'
    })

    const result = clientAliasResolver(
      '@',
      '/Users/project/modules/mrt-builder/client/src/index.tsx'
    )

    expect(result).toBe('/Users/project/modules/mrt-builder/client/src')
  })

  it('logs an error and returns null if no candidates exist', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false)
    const consoleSpy = vi.spyOn(console, 'error')

    const result = clientAliasResolver(
      '@/non-existent-file',
      '/Users/project/modules/mrt-builder/client/src/index.tsx'
    )

    expect(result).toBeNull()
    expect(consoleSpy).toHaveBeenCalledWith(
      '[vite] failed to resolve import "@/non-existent-file" from "/Users/project/modules/mrt-builder/client/src/index.tsx"'
    )
  })
})
