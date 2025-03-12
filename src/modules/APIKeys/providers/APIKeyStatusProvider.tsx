import {
  APIFallbackComponent,
  MissingAPIKeyScreen,
  ModuleWrapper
} from '@lifeforge/ui'

import useFetch from '@hooks/useFetch'

function APIKeyStatusProvider({
  APIKeys,
  children
}: {
  APIKeys: string[]
  children: React.ReactNode
}) {
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
