import { createContext, useContext } from 'react'

import type { IPersonalizationData } from './interfaces/personalization_provider_interfaces'

export const PersonalizationContext = createContext<
  IPersonalizationData | undefined
>(undefined)

export default function usePersonalization(): IPersonalizationData {
  const context = useContext(PersonalizationContext)
  if (context === undefined) {
    throw new Error(
      'usePersonalizationContext must be used within a PersonalizationProvider'
    )
  }
  return context
}
