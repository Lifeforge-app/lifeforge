import { describe, expect, it } from 'vitest'

import { deriveModuleNamespace } from './moduleNamespace'

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
