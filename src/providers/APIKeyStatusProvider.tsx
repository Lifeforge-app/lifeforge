import React from 'react'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import MissingAPIKeyScreen from '@components/screens/MissingAPIKeyScreen'
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
