import fs from 'node:fs'
import path from 'node:path'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { clientAliasResolver } from '../resolvers/client-alias-resolver'

vi.mock('node:fs', () => {
  return {
    default: {
      existsSync: vi.fn()
    }
  }
})

// Build paths with node:path so they are valid on any platform.
const ROOT = path.resolve('/project')
const CLIENT = path.join(ROOT, 'modules', 'mrt-builder', 'client')
const CLIENT_SRC = path.join(CLIENT, 'src')
const WEB = path.join(ROOT, 'apps', 'web')
const WEB_SRC = path.join(WEB, 'src')
const CORE_SRC = path.join(ROOT, 'packages', 'core', 'src')

/** Normalizes a path to forward slashes for cross-platform comparisons. */
function norm(p: string): string {
  return p.replace(/\\/g, '/')
}

/** Mocks existsSync to return true only for the given (normalized) paths. */
function mockExistsSync(...expected: string[]) {
  const normalized = expected.map(norm)

  vi.mocked(fs.existsSync).mockImplementation(pathToCheck => {
    return normalized.includes(norm(pathToCheck as string))
  })
}

describe('clientAliasResolver', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('returns null if importer is not defined', () => {
    expect(clientAliasResolver('@/components/Button', undefined)).toBeNull()
  })

  it('returns null if rootDir cannot be determined', () => {
    const importer = path.join(ROOT, 'build', 'index.js')

    expect(clientAliasResolver('@/components/Button', importer)).toBeNull()
  })

  it('resolves "@/manifest" relative to the client root directory', () => {
    const importer = path.join(CLIENT_SRC, 'index.tsx')
    const expected = path.join(CLIENT, 'manifest.ts')

    mockExistsSync(expected)

    const result = clientAliasResolver('@/manifest', importer)

    expect(norm(result!)).toBe(norm(expected))
  })

  it('resolves "@/manifest.ts" when the extension is explicit', () => {
    const importer = path.join(CLIENT_SRC, 'index.tsx')
    const expected = path.join(CLIENT, 'manifest.ts')

    mockExistsSync(expected)

    const result = clientAliasResolver('@/manifest.ts', importer)

    expect(norm(result!)).toBe(norm(expected))
  })

  it('resolves components relative to the client "src" directory', () => {
    const importer = path.join(CLIENT_SRC, 'index.tsx')
    const expected = path.join(CLIENT_SRC, 'components', 'Button.tsx')

    mockExistsSync(expected)

    const result = clientAliasResolver('@/components/Button', importer)

    expect(norm(result!)).toBe(norm(expected))
  })

  it('resolves nested subpaths relative to the client "src" directory', () => {
    const importer = path.join(CLIENT_SRC, 'index.tsx')
    const expected = path.join(
      CLIENT_SRC,
      'core',
      'providers',
      'features',
      'CoreFederationProvider.tsx'
    )

    mockExistsSync(expected)

    const result = clientAliasResolver(
      '@/core/providers/features/CoreFederationProvider',
      importer
    )

    expect(norm(result!)).toBe(norm(expected))
  })

  it('resolves components for a "web" project root', () => {
    const importer = path.join(WEB_SRC, 'index.tsx')
    const expected = path.join(WEB_SRC, 'core', 'utils', 'forgeAPI.ts')

    mockExistsSync(expected)

    const result = clientAliasResolver('@/core/utils/forgeAPI', importer)

    expect(norm(result!)).toBe(norm(expected))
  })

  it('resolves a ".ts" file when no ".tsx" variant exists', () => {
    const importer = path.join(CLIENT_SRC, 'index.tsx')
    const expected = path.join(CLIENT_SRC, 'utils', 'math.ts')

    mockExistsSync(expected)

    const result = clientAliasResolver('@/utils/math', importer)

    expect(norm(result!)).toBe(norm(expected))
  })

  it('resolves a ".json" file', () => {
    const importer = path.join(CLIENT_SRC, 'index.tsx')
    const expected = path.join(CLIENT_SRC, 'config', 'app.json')

    mockExistsSync(expected)

    const result = clientAliasResolver('@/config/app', importer)

    expect(norm(result!)).toBe(norm(expected))
  })

  it('resolves index files when no file extension is specified', () => {
    const importer = path.join(CLIENT_SRC, 'index.tsx')
    const expected = path.join(CLIENT_SRC, 'components', 'Layout', 'index.tsx')

    mockExistsSync(expected)

    const result = clientAliasResolver('@/components/Layout', importer)

    expect(norm(result!)).toBe(norm(expected))
  })

  it('resolves using standard package "src" directories', () => {
    const importer = path.join(CORE_SRC, 'index.ts')
    const expected = path.join(CORE_SRC, 'utils', 'math.ts')

    mockExistsSync(expected)

    const result = clientAliasResolver('@/utils/math', importer)

    expect(norm(result!)).toBe(norm(expected))
  })

  it('handles the "@fs" prefix and normalizes paths', () => {
    const importer = '/@fs/' + norm(path.join(CLIENT_SRC, 'index.tsx'))
    const expected = path.join(CLIENT_SRC, 'utils.ts')

    mockExistsSync(expected)

    const result = clientAliasResolver('@/utils', importer)

    expect(norm(result!)).toBe(norm(expected))
  })

  it('resolves the base import "@" to the src directory', () => {
    const importer = path.join(CLIENT_SRC, 'index.tsx')

    mockExistsSync(CLIENT_SRC)

    const result = clientAliasResolver('@', importer)

    expect(norm(result!)).toBe(norm(CLIENT_SRC))
  })

  it('logs an error and returns null if no candidates exist', () => {
    const importer = path.join(CLIENT_SRC, 'index.tsx')
    const consoleSpy = vi.spyOn(console, 'error')

    mockExistsSync()

    const result = clientAliasResolver('@/non-existent-file', importer)

    expect(result).toBeNull()
    expect(consoleSpy).toHaveBeenCalled()
  })
})
