import { afterEach, describe, expect, it } from 'vitest'

import { setLoadingModuleId } from './loadingModule'
import { deriveModuleNamespace, resolveCallerModuleId } from './moduleNamespace'

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
      deriveModuleNamespace('@lifeforge/melvinchia3636--truckers-log')
    ).toBe('melvinchia3636___truckers_log')
    expect(deriveModuleNamespace('melvinchia3636--invoice-maker')).toBe(
      'melvinchia3636___invoice_maker'
    )
  })

  it('handles unscoped ids', () => {
    expect(deriveModuleNamespace('lifeforge--app')).toBe('app')
    expect(deriveModuleNamespace('dashboard')).toBe('dashboard')
  })
})

describe('resolveCallerModuleId', () => {
  afterEach(() => {
    setLoadingModuleId(undefined)
  })

  it('returns the id the loader is currently importing', () => {
    setLoadingModuleId('lifeforge--calendar')

    expect(resolveCallerModuleId()).toBe('lifeforge--calendar')
  })

  it('returns undefined when nothing is being imported', () => {
    expect(resolveCallerModuleId()).toBeUndefined()
  })
})
