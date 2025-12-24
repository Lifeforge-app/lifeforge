import { OptionsColumn, Switch } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'shared'

import DisableTwoFAModal from '../modals/DisableTwoFAModal'
import EnableTwoFAModal from '../modals/EnableTwoFAModal'

function TwoFAColumn() {
  const open = useModalStore(state => state.open)

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
        <div className="flex w-full items-center justify-between gap-3">
          <span className="text-bg-500">
            {t(userData.twoFAEnabled ? 'misc.enabled' : 'misc.disabled')}
          </span>
          <Switch
            value={userData.twoFAEnabled}
            onChange={handleToggle2FAModal}
          />
        </div>
      </OptionsColumn>
    </>
  )
}

export default TwoFAColumn
