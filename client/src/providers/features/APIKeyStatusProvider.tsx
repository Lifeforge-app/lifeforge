import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { type ModuleCategory } from '@lifeforge/federation'
import {
  Button,
  Card,
  EmptyStateScreen,
  Stack,
  Text,
  WithQuery
} from '@lifeforge/ui'

import forgeAPI from '@/forgeAPI'

function APIKeyStatusProvider({
  APIKeyAccess,
  children
}: {
  APIKeyAccess: ModuleCategory['items'][number]['APIKeyAccess']
  children: React.ReactNode
}) {
  const { t } = useTranslation('common.api-keys')

  const requiredAPIKeys = Object.entries(APIKeyAccess ?? {})
    .filter(([_, value]) => value.required)
    .map(([key]) => key)

  const hasRequiredAPIKeysQuery = useQuery(
    forgeAPI
      .checkAPIKeys({
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
                    <Stack
                      centered
                      px="xl"
                      width={{
                        sm: '75%',
                        lg: '50%'
                      }}
                    >
                      <Text align="center" as="p" color="muted" size="lg">
                        {t('missing.description')}
                      </Text>
                      {requiredAPIKeys.map((key, index) => (
                        <Card key={index} width="100%">
                          <Text
                            as="code"
                            color={{ base: 'bg-800', dark: 'bg-100' }}
                            size="lg"
                          >
                            {key}
                          </Text>
                          <Text as="p" color="muted" mt="xs">
                            {
                              APIKeyAccess?.[key as keyof typeof APIKeyAccess]
                                .usage
                            }
                          </Text>
                        </Card>
                      ))}
                      <Button
                        as={Link}
                        icon="tabler:arrow-right"
                        iconPosition="end"
                        namespace="common.api-keys"
                        to="/api-keys"
                        width="100%"
                      >
                        configAPIKeys
                      </Button>
                    </Stack>
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
