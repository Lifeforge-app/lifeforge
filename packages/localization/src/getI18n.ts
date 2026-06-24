import type { i18n } from 'i18next'

let _i18nInstance: i18n | null = null

export function getI18n(): i18n | null {
  return _i18nInstance
}

export function setI18n(instance: i18n): void {
  _i18nInstance = instance
}
