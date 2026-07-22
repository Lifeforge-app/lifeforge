import { useTranslation } from 'react-i18next'

import {
  Button,
  Flex,
  OptionsColumn,
  Text,
  WithQueryData,
  useModalStore
} from '@lifeforge/ui'

import OAuthConfigModal from '@/core/accountSettings/modals/OAuthConfigModal'
import forgeAPI from '@/forgeAPI'

function OAuthConfigColumn() {
  const { open } = useModalStore()
  const { t } = useTranslation('common.account-settings')

  return (
    <OptionsColumn
      description={t('settings.desc.oauth')}
      icon="tabler:login"
      title={t('settings.title.oauth')}
    >
      <WithQueryData contract={forgeAPI.auth.oauth.providers.listOptions}>
        {data => (
          <Flex align="center" gap="md">
            <Text color="muted">
              {t('misc.oauthStatus', {
                confCount: data.filter(e => e.configured).length,
                enabledCount: data.filter(e => e.enabled).length
              })}
            </Text>
            <Button
              icon="tabler:settings"
              namespace="common.account-settings"
              variant="secondary"
              width={{ base: '100%', md: 'auto' }}
              onClick={() => open(OAuthConfigModal, {})}
            >
              Configure
            </Button>
          </Flex>
        )}
      </WithQueryData>
    </OptionsColumn>
  )
}

export default OAuthConfigColumn
