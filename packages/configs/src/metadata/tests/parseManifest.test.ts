import fs from 'fs'
import path from 'path'
import { afterEach, describe, expect, it } from 'vitest'

import extractModuleMetadata from '../extractModuleMetadata'
import parseManifest from '../parseManifest'

const tempDir = path.join(import.meta.dirname, 'temp-module')
const tempFilePath = path.join(tempDir, 'manifest.ts')
const widgetDir = path.join(tempDir, 'src', 'widgets')
const widgetFilePath = path.join(widgetDir, 'ISS.tsx')

function cleanup(): void {
  if (fs.existsSync(widgetFilePath)) {
    fs.unlinkSync(widgetFilePath)
  }

  if (fs.existsSync(widgetDir)) {
    fs.rmdirSync(widgetDir)
  }

  const srcDir = path.join(tempDir, 'src')

  if (fs.existsSync(srcDir)) {
    fs.rmdirSync(srcDir)
  }

  if (fs.existsSync(tempFilePath)) {
    fs.unlinkSync(tempFilePath)
  }

  if (fs.existsSync(tempDir)) {
    fs.rmdirSync(tempDir)
  }
}

describe('parseManifest AST parser', () => {
  afterEach(cleanup)

  it('returns empty result for non-existent file', () => {
    expect(parseManifest('non-existent-file.ts')).toEqual({
      hasProvider: false,
      widgets: []
    })
  })

  it('returns empty result if createForgeModule is not found', () => {
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }
    fs.writeFileSync(
      tempFilePath,
      `
      export default {
        routes: {}
      }
    `
    )

    expect(parseManifest(tempFilePath)).toEqual({
      hasProvider: false,
      widgets: []
    })
  })

  it('returns empty result if the argument is not an object', () => {
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }
    fs.writeFileSync(
      tempFilePath,
      `
      import { createForgeModule } from '@lifeforge/federation'
      const manifest = createForgeModule('invalid')
      export default manifest
    `
    )

    expect(parseManifest(tempFilePath)).toEqual({
      hasProvider: false,
      widgets: []
    })
  })

  it('parses provider, hidden, and subsections successfully', () => {
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }
    fs.writeFileSync(
      tempFilePath,
      `
      import { createForgeModule } from '@lifeforge/federation'
      const manifest = createForgeModule({
        provider: () => import('@/providers/ModuleProvider'),
        hidden: true,
        subsection: [
          { label: 'Dashboard', icon: 'tabler:dashboard', path: '' },
          { label: 'Transactions', icon: 'tabler:arrows-exchange', path: 'transactions' }
        ],
        routes: {}
      })
      export default manifest
    `
    )

    expect(parseManifest(tempFilePath)).toEqual({
      hasProvider: true,
      hidden: true,
      subsection: [
        { label: 'Dashboard', icon: 'tabler:dashboard', path: '' },
        {
          label: 'Transactions',
          icon: 'tabler:arrows-exchange',
          path: 'transactions'
        }
      ],
      widgets: []
    })
  })

  it('parses valid manifest and resolves widgets successfully', () => {
    if (!fs.existsSync(widgetDir)) {
      fs.mkdirSync(widgetDir, { recursive: true })
    }
    fs.writeFileSync(
      tempFilePath,
      `
      import { createForgeModule } from '@lifeforge/federation'
      const manifest = createForgeModule({
        widgets: [
          () => import('@/widgets/ISS')
        ],
        routes: {}
      })
      export default manifest
    `
    )
    fs.writeFileSync(
      widgetFilePath,
      `
      export const config = {
        id: 'iss-tracker',
        icon: 'tabler:satellite',
        minW: 2,
        minH: 2
      }
    `
    )

    const result = parseManifest(tempFilePath)

    expect(result.hasProvider).toBe(false)
    expect(result.hidden).toBeUndefined()
    expect(result.subsection).toBeUndefined()
    expect(result.widgets).toHaveLength(1)

    const widget = result.widgets[0]

    if (!widget) {
      throw new Error('Expected a parsed widget')
    }

    expect(widget.filePath).toBe(widgetFilePath)
    expect(widget.config).toEqual({
      id: 'iss-tracker',
      icon: 'tabler:satellite',
      minW: 2,
      minH: 2
    })
  })
})

describe('extractModuleMetadata', () => {
  const moduleDir = path.join(import.meta.dirname, 'temp-extract-module')
  const clientDir = path.join(moduleDir, 'client')
  const manifestPath = path.join(clientDir, 'manifest.ts')
  const widgetDir = path.join(clientDir, 'src', 'widgets')
  const widgetPath = path.join(widgetDir, 'ISS.tsx')
  const packageJSONPath = path.join(moduleDir, 'package.json')

  const packageJSON = {
    name: '@lifeforge/lifeforge--iss',
    displayName: 'ISS Tracker',
    version: '1.2.3',
    description: 'Track the ISS',
    author: 'lifeforge',
    lifeforge: {
      icon: 'tabler:satellite',
      category: 'Fun'
    }
  }

  afterEach(() => {
    if (fs.existsSync(moduleDir)) {
      fs.rmSync(moduleDir, { recursive: true, force: true })
    }
  })

  it('produces serializable bundled metadata with package + hasServer', () => {
    fs.mkdirSync(widgetDir, { recursive: true })
    fs.writeFileSync(
      manifestPath,
      `
      import { createForgeModule } from '@lifeforge/federation'
      const manifest = createForgeModule({
        hidden: true,
        subsection: [{ label: 'Dashboard', icon: 'tabler:dashboard', path: '' }],
        widgets: [() => import('@/widgets/ISS')],
        routes: {}
      })
      export default manifest
    `
    )
    fs.writeFileSync(
      widgetPath,
      `
      export const config = {
        id: 'iss-tracker',
        icon: 'tabler:satellite',
        minW: 2,
        minH: 2
      }
    `
    )
    fs.writeFileSync(packageJSONPath, JSON.stringify(packageJSON))

    const metadata = extractModuleMetadata(moduleDir)

    expect(metadata).toEqual({
      hasProvider: false,
      hidden: true,
      subsection: [{ label: 'Dashboard', icon: 'tabler:dashboard', path: '' }],
      widgets: [
        {
          id: 'iss-tracker',
          icon: 'tabler:satellite',
          minW: 2,
          minH: 2,
          componentName: 'ISS'
        }
      ],
      package: packageJSON,
      hasServer: false
    })
  })
})
