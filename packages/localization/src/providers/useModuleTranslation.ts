import { useTranslation } from 'react-i18next'

import { useModuleMetadata } from '@lifeforge/federation'

export function useModuleTranslation(extraKeys: string[] = []) {
  const { name } = useModuleMetadata()

  return useTranslation([`apps.${name ?? ''}`, ...extraKeys])
}
