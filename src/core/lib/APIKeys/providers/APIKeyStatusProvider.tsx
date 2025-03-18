import { useAPIQuery } from '@lifeforge/core'
import { MissingAPIKeyScreen, ModuleWrapper, QueryWrapper } from '@lifeforge/ui'

function APIKeyStatusProvider({
  APIKeys,
  children
}: {
  APIKeys: string[]
  children: React.ReactNode
}) {
  const hasRequiredAPIKeysQuery = useAPIQuery<boolean>(
    `api-keys/entries/check?keys=${encodeURIComponent(APIKeys.join(','))}`,
    ['api-keys', 'entries', 'check', APIKeys.join(',')],
    APIKeys.length > 0
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
