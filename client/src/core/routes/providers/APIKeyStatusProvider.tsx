import MissingAPIKeyScreen from '@core/routes/components/MissingAPIKeyScreen'
import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { ModuleWrapper, QueryWrapper } from 'lifeforge-ui'

function APIKeyStatusProvider({
  APIKeys,
  children
}: {
  APIKeys: string[]
  children: React.ReactNode
}) {
  const hasRequiredAPIKeysQuery = useQuery(
    forgeAPI.apiKeys.entries.checkKeys
      .input({
        keys: APIKeys.join(',')
      })
      .queryOptions({
        enabled: APIKeys.length > 0
      })
  )

  return (
    <>
      {APIKeys.length > 0 ? (
        <QueryWrapper query={hasRequiredAPIKeysQuery}>
          {hasRequiredAPIKeys =>
            hasRequiredAPIKeys ? (
              <>{children}</>
            ) : (
              <ModuleWrapper>
                <MissingAPIKeyScreen requiredAPIKeys={APIKeys} />
              </ModuleWrapper>
            )
          }
        </QueryWrapper>
      ) : (
        children
      )}
    </>
  )
}

export default APIKeyStatusProvider
