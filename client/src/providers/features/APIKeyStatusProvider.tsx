import { useQuery } from '@tanstack/react-query'
import { Button, Card, EmptyStateScreen, WithQuery } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { Link, type ModuleConfig } from 'shared'

import forgeAPI from '@/utils/forgeAPI'

function APIKeyStatusProvider({
  APIKeyAccess,
  children
}: {
  APIKeyAccess: ModuleConfig['APIKeyAccess']
  children: React.ReactNode
}) {
  const { t } = useTranslation('common.apiKeys')

  const requiredAPIKeys = Object.entries(APIKeyAccess ?? {})
    .filter(([_, value]) => value.required)
    .map(([key]) => key)

  const hasRequiredAPIKeysQuery = useQuery(
    forgeAPI.apiKeys.entries.checkKeys
      .input({
        keys: requiredAPIKeys.join(',')
      })
      .queryOptions({
        enabled: requiredAPIKeys.length > 0
      })
  )

  return (
    <>
      {requiredAPIKeys.length > 0 ? (
        <WithQuery query={hasRequiredAPIKeysQuery}>
          {hasRequiredAPIKeys =>
            hasRequiredAPIKeys ? (
              <>{children}</>
            ) : (
              <EmptyStateScreen
                icon="tabler:key-off"
                message={{
                  title: t('missing.title'),
                  description: (
                    <div className="flex-center w-full flex-col gap-4 space-y-3 px-8 sm:w-3/4 lg:w-1/2">
                      <p className="text-bg-400 dark:text-bg-600 text-center text-lg">
                        {t('missing.description')}
                      </p>
                      {requiredAPIKeys.map((key, index) => (
                        <Card key={index} className="w-full">
                          <code className="text-xl">{key}</code>
                          <p className="text-bg-500 mt-1">
                            {
                              APIKeyAccess?.[key as keyof typeof APIKeyAccess]
                                .usage
                            }
                          </p>
                        </Card>
                      ))}
                      <Button
                        as={Link}
                        className="w-full"
                        icon="tabler:arrow-right"
                        iconPosition="end"
                        namespace="common.apiKeys"
                        to="/api-keys"
                      >
                        configAPIKeys
                      </Button>
                    </div>
                  )
                }}
              />
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
