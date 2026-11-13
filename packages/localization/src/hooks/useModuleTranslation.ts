import { useTranslation } from 'react-i18next'

import { useModuleMetadata } from '@lifeforge/federation'

export function useModuleTranslation(extraKeys: string[] = []) {
  const { name } = useModuleMetadata()

  const ns = name ? `apps.${name}` : undefined

  const { t, i18n, ready } = useTranslation(ns ? [ns, ...extraKeys] : extraKeys)

  return { t, i18n, ready, ns }
}
