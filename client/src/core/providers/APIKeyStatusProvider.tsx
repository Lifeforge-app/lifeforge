import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { EmptyStateScreen, ModuleWrapper, WithQuery } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

function APIKeyStatusProvider({
  APIKeys,
  children
}: {
  APIKeys: string[]
  children: React.ReactNode
}) {
  const { t } = useTranslation('core.apiKeys')

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
        <WithQuery query={hasRequiredAPIKeysQuery}>
          {hasRequiredAPIKeys =>
            hasRequiredAPIKeys ? (
              <>{children}</>
            ) : (
              <ModuleWrapper>
                <EmptyStateScreen
                  CTAButtonProps={{
                    as: Link,
                    icon: 'tabler:arrow-right',
                    iconPosition: 'end',
                    to: '/api-keys',
                    children: 'configAPIKeys',
                    namespace: 'core.apiKeys'
                  }}
                  description={
                    <>
                      <p className="text-bg-500 text-center text-lg">
                        {t('missing.description')}
                      </p>
                      <p className="text-bg-500 mt-4 mb-8 text-center text-lg">
                        {t('missing.requiredKeysAre')}{' '}
                        <code>{APIKeys.join(', ')}</code>
                      </p>
                    </>
                  }
                  icon="tabler:key-off"
                  name={false}
                  title={t('missing.title')}
                />
              </ModuleWrapper>
            )
          }
        </WithQuery>
      ) : (
        children
      )}
    </>
  )
}

export default APIKeyStatusProvider
