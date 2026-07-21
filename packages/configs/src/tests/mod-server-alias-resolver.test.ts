import fs from 'node:fs'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { serverAliasResolver } from '../resolvers/mod-server-alias-resolver'

const mockRequire = vi.hoisted(() => ({
  resolve: vi.fn()
}))

vi.mock('node:module', async importOriginal => {
  const actual = await importOriginal<typeof import('node:module')>()

  return {
    ...actual,
    createRequire: () => mockRequire
  }
})

vi.mock('node:fs', async importOriginal => {
  const actual = await importOriginal<any>()

  return {
    default: {
      ...actual.default,
      existsSync: vi.fn(),
      readFileSync: vi.fn()
    }
  }
})

describe('serverAliasResolver', () => {
  const dirname = '/test/dir'

  let plugin: any

  beforeEach(async () => {
    vi.clearAllMocks()
    const actualFs = await vi.importActual<typeof import('node:fs')>('node:fs')

    // Mock file system check and read for apps/api/package.json, fall back to actual fs
    vi.mocked(fs.existsSync).mockImplementation(filePath => {
      if ((filePath as string).endsWith('apps/api/package.json')) {
        return true
      }

      return actualFs.existsSync(filePath)
    })

    vi.mocked(fs.readFileSync).mockImplementation((filePath, options) => {
      if ((filePath as string).endsWith('apps/api/package.json')) {
        return JSON.stringify({
          dependencies: {
            zod: 'workspace:*',
            dayjs: '^1.11.0',
            express: '^4.18.0'
          },
          devDependencies: {}
        })
      }

      return actualFs.readFileSync(filePath, options)
    })

    plugin = serverAliasResolver(dirname)
  })

  it('has the correct plugin properties', () => {
    expect(plugin.name).toBe('externalize-node-modules')
    expect(plugin.enforce).toBe('pre')
  })

  it('ignores relative imports', () => {
    expect(plugin.resolveId('./some-file')).toBeNull()
    expect(plugin.resolveId('../parent-file')).toBeNull()
  })

  it('ignores absolute imports', () => {
    expect(plugin.resolveId('/absolute/path')).toBeNull()
  })

  it('ignores Vite virtual modules', () => {
    expect(plugin.resolveId('\0virtual:module')).toBeNull()
    expect(plugin.resolveId('virtual:other-module')).toBeNull()
  })

  it('unconditionally externalizes native Node built-in imports', () => {
    expect(plugin.resolveId('node:fs')).toEqual({
      id: 'node:fs',
      external: true
    })
    expect(plugin.resolveId('node:fs/promises')).toEqual({
      id: 'node:fs/promises',
      external: true
    })
  })

  it('ignores standard config aliases', () => {
    const config = {
      resolve: {
        alias: [
          { find: /^@\/(.*)$/, replacement: `${dirname}/$1` },
          { find: /^@$/, replacement: `${dirname}/index` }
        ]
      }
    }
    plugin.configResolved(config)

    expect(plugin.resolveId('@/routes/events')).toBeNull()
    expect(plugin.resolveId('@')).toBeNull()
  })

  it('ignores custom aliases configured by developer', () => {
    const config = {
      resolve: {
        alias: [
          { find: '@something', replacement: '/custom/path' },
          { find: '@components', replacement: '/components/path' }
        ]
      }
    }
    plugin.configResolved(config)

    expect(plugin.resolveId('@something/someInternalModule')).toBeNull()
    expect(plugin.resolveId('@components/Button')).toBeNull()
  })

  it('externalizes core bare packages as-is', () => {
    expect(plugin.resolveId('zod')).toEqual({ id: 'zod', external: true })
    expect(plugin.resolveId('@lifeforge/server-utils')).toEqual({
      id: '@lifeforge/server-utils',
      external: true
    })
  })

  it('bundles module-specific packages', () => {
    expect(plugin.resolveId('rrule')).toBeNull()
    expect(plugin.resolveId('node-ical')).toBeNull()
    expect(plugin.resolveId('react-markdown')).toBeNull()
  })

  it('resolves and appends file extension for core subpath imports', () => {
    mockRequire.resolve.mockReturnValue(
      '/test/dir/node_modules/dayjs/plugin/utc.js'
    )

    expect(plugin.resolveId('dayjs/plugin/utc')).toEqual({
      id: 'dayjs/plugin/utc.js',
      external: true
    })
    expect(mockRequire.resolve).toHaveBeenCalledWith('dayjs/plugin/utc', {
      paths: [dirname]
    })
  })

  it('preserves query parameters and hashes during resolution for core subpaths', () => {
    mockRequire.resolve.mockReturnValue(
      '/test/dir/node_modules/dayjs/plugin/utc.js'
    )

    expect(plugin.resolveId('dayjs/plugin/utc?url#hash')).toEqual({
      id: 'dayjs/plugin/utc.js?url#hash',
      external: true
    })
    expect(mockRequire.resolve).toHaveBeenCalledWith('dayjs/plugin/utc', {
      paths: [dirname]
    })
  })

  it('resolves directory index files correctly for core dependencies', () => {
    mockRequire.resolve.mockReturnValue(
      '/test/dir/node_modules/@lifeforge/server-utils/subfolder/index.js'
    )

    expect(plugin.resolveId('@lifeforge/server-utils/subfolder')).toEqual({
      id: '@lifeforge/server-utils/subfolder/index.js',
      external: true
    })
  })

  it('normalizes Windows backslashes in resolved paths for core dependencies', () => {
    mockRequire.resolve.mockReturnValue(
      'C:\\test\\dir\\node_modules\\dayjs\\plugin\\utc.js'
    )

    expect(plugin.resolveId('dayjs/plugin/utc')).toEqual({
      id: 'dayjs/plugin/utc.js',
      external: true
    })
  })

  it('does not double-append extension if already present', () => {
    mockRequire.resolve.mockReturnValue(
      '/test/dir/node_modules/dayjs/plugin/utc.js'
    )

    expect(plugin.resolveId('dayjs/plugin/utc.js')).toEqual({
      id: 'dayjs/plugin/utc.js',
      external: true
    })
  })

  it('falls back to bare specifier if resolution fails for core dependencies', () => {
    mockRequire.resolve.mockImplementation(() => {
      throw new Error('Module not found')
    })

    expect(plugin.resolveId('dayjs/plugin/utc')).toEqual({
      id: 'dayjs/plugin/utc',
      external: true
    })
  })
})
