import React from 'react'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIFallbackComponent from '@components/Screens/APIComponentWithFallback'
import MissingAPIKeyScreen from '@components/Screens/MissingAPIKeyScreen'
import useFetch from '@hooks/useFetch'

function APIKeyStatusProvider({
  APIKeys,
  children
}: {
  APIKeys: string[]
  children: React.ReactNode
}): React.ReactElement {
  const [hasRequiredAPIKeys] = useFetch<boolean>(
    `api-keys/check?keys=${encodeURIComponent(APIKeys.join(','))}`,
    APIKeys.length > 0
  )

  return (
    <>
      {APIKeys.length > 0 ? (
        <APIFallbackComponent data={hasRequiredAPIKeys}>
          {hasRequiredAPIKeys =>
            hasRequiredAPIKeys ? (
              <>{children}</>
            ) : (
              <ModuleWrapper>
                <MissingAPIKeyScreen requiredAPIKeys={APIKeys} />
              </ModuleWrapper>
            )
          }
        </APIFallbackComponent>
      ) : (
        children
      )}
    </>
  )
}

export default APIKeyStatusProvider
