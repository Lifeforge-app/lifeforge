import { describe, expect, it } from 'vitest'

import * as contractInterfaces from '../interfaces'
import * as moduleTypes from '../interfaces/module.types'
import * as widgetTypes from '../interfaces/widget.types'

describe('contract interface exports', () => {
  it('re-exports the current metadata schemas', () => {
    expect(contractInterfaces.apiKeyAccessSchema).toBe(
      moduleTypes.apiKeyAccessSchema
    )
    expect(contractInterfaces.moduleConfigSchema).toBe(
      moduleTypes.moduleConfigSchema
    )
    expect(contractInterfaces.moduleEntrySchema).toBe(
      moduleTypes.moduleEntrySchema
    )
    expect(contractInterfaces.moduleManifestSchema).toBe(
      moduleTypes.moduleManifestSchema
    )
    expect(contractInterfaces.modulePackageJSONSchema).toBe(
      moduleTypes.modulePackageJSONSchema
    )
    expect(contractInterfaces.moduleSchema).toBe(moduleTypes.moduleSchema)
    expect(contractInterfaces.moduleWidgetSchema).toBe(
      moduleTypes.moduleWidgetSchema
    )
    expect(contractInterfaces.widgetConfigSchema).toBe(
      widgetTypes.widgetConfigSchema
    )
  })
})
