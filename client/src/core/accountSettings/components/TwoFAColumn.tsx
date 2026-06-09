import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@/providers/AuthProvider'
import { Flex, OptionsColumn, Switch, Text, useModalStore } from '@lifeforge/ui'

import DisableTwoFAModal from '../modals/DisableTwoFAModal'
import EnableTwoFAModal from '../modals/EnableTwoFAModal'

function TwoFAColumn() {
  const { open } = useModalStore()

  const { t } = useTranslation('common.accountSettings')

  const { userData } = useAuth()

  if (!userData) return null

  const handleToggle2FAModal = useCallback(() => {
    if (userData.twoFAEnabled) {
      open(DisableTwoFAModal, {})
    } else {
      open(EnableTwoFAModal, {})
    }
  }, [userData.twoFAEnabled])

  return (
    <>
      <OptionsColumn
        description={t('settings.desc.twoFA')}
        icon="tabler:lock-access"
        title={t('settings.title.twoFA')}
      >
        <Flex align="center" gap="md" justify="between" width="100%">
          <Text color="muted">
            {t(userData.twoFAEnabled ? 'misc.enabled' : 'misc.disabled')}
          </Text>
          <Switch
            value={userData.twoFAEnabled}
            onChange={handleToggle2FAModal}
          />
        </Flex>
      </OptionsColumn>
    </>
  )
}

export default TwoFAColumn
