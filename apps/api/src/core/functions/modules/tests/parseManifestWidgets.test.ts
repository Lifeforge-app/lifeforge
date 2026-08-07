import fs from 'fs'
import path from 'path'
import { afterEach, describe, expect, it } from 'vitest'

import parseManifestWidgets from '../parseManifestWidgets'

describe('parseManifestWidgets AST parser', () => {
  const tempDir = path.join(__dirname, 'temp-module')
  const tempFilePath = path.join(tempDir, 'manifest.ts')
  const widgetDir = path.join(tempDir, 'src', 'widgets')
  const widgetFilePath = path.join(widgetDir, 'ISS.tsx')

  afterEach(() => {
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
  })

  it('returns empty array for non-existent file', () => {
    expect(parseManifestWidgets('non-existent-file.ts')).toEqual([])
  })

  it('returns empty array if createForgeModule is not found', () => {
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
    expect(parseManifestWidgets(tempFilePath)).toEqual([])
  })

  it('returns empty array if widgets is not defined', () => {
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }
    fs.writeFileSync(
      tempFilePath,
      `
      import { createForgeModule } from '@lifeforge/federation'
      const manifest = createForgeModule({
        routes: {}
      })
      export default manifest
    `
    )
    expect(parseManifestWidgets(tempFilePath)).toEqual([])
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

    const result = parseManifestWidgets(tempFilePath)
    expect(result).toHaveLength(1)
    expect(result[0].filePath).toBe(widgetFilePath)
    expect(result[0].config).toEqual({
      id: 'iss-tracker',
      icon: 'tabler:satellite',
      minW: 2,
      minH: 2
    })
  })
})
