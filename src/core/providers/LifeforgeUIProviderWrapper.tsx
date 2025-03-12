import React from 'react'

import { LifeforgeUIProvider } from '@lifeforge/ui'

import { usePersonalizationContext } from './PersonalizationProvider'

function LifeforgeUIProviderWrapper({
  children
}: {
  children: React.ReactNode
}): React.ReactElement {
  const personalization = usePersonalizationContext()

  return (
    <LifeforgeUIProvider
      personalization={{
        apiHost: import.meta.env.VITE_API_HOST,
        googleAPIKey: import.meta.env.VITE_GOOGLE_API_KEY,
        ...personalization,
        themeColor: personalization.rawThemeColor
      }}
    >
      {children}
    </LifeforgeUIProvider>
  )
}

export default LifeforgeUIProviderWrapper
