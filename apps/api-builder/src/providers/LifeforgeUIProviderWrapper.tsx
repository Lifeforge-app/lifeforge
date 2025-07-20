import { LifeforgeUIProvider } from '@lifeforge/ui'

import usePersonalization from './PersonalizationProvider/usePersonalization'

function LifeforgeUIProviderWrapper({
  children
}: {
  children: React.ReactNode
}) {
  const personalization = usePersonalization()

  return (
    <LifeforgeUIProvider
      personalization={{
        apiHost: import.meta.env.VITE_API_HOST,
        ...personalization,
        themeColor: personalization.rawThemeColor
      }}
    >
      {children}
    </LifeforgeUIProvider>
  )
}

export default LifeforgeUIProviderWrapper
