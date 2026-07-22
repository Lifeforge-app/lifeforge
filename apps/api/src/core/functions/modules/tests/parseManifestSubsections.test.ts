import { afterEach, describe, expect, it } from 'vitest'
import fs from 'fs'
import path from 'path'
import parseManifestSubsections from '../parseManifestSubsections'

describe('parseManifestSubsections AST parser', () => {
  const tempFilePath = path.join(__dirname, 'temp-manifest.ts')

  afterEach(() => {
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath)
    }
  })

  it('returns undefined for non-existent file', () => {
    expect(parseManifestSubsections('non-existent-file.ts')).toBeUndefined()
  })

  it('returns undefined if createForgeModule is not found', () => {
    fs.writeFileSync(
      tempFilePath,
      `
      export default {
        routes: {}
      }
    `
    )
    expect(parseManifestSubsections(tempFilePath)).toBeUndefined()
  })

  it('returns undefined if subsection is not defined', () => {
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
    expect(parseManifestSubsections(tempFilePath)).toBeUndefined()
  })

  it('parses valid subsections successfully', () => {
    fs.writeFileSync(
      tempFilePath,
      `
      import { createForgeModule } from '@lifeforge/federation'
      const manifest = createForgeModule({
        subsection: [
          { label: 'Dashboard', icon: 'tabler:dashboard', path: '' },
          { label: 'Transactions', icon: 'tabler:arrows-exchange', path: 'transactions' }
        ],
        routes: {}
      })
      export default manifest
    `
    )
    expect(parseManifestSubsections(tempFilePath)).toEqual([
      { label: 'Dashboard', icon: 'tabler:dashboard', path: '' },
      { label: 'Transactions', icon: 'tabler:arrows-exchange', path: 'transactions' }
    ])
  })
})
