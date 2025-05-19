import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { ConfigColumn, Switch } from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

import { useAuth } from '../../Auth/providers/AuthProvider'

function TwoFAColumn() {
  const open = useModalStore(state => state.open)
  const { t } = useTranslation('core.accountSettings')
  const { userData } = useAuth()

  const handleToggle2FAModal = useCallback(() => {
    if (userData.twoFAEnabled) {
      open('accountSettings.disable2FA', {})
    } else {
      open('accountSettings.enable2FA', {})
    }
  }, [userData.twoFAEnabled])

  return (
    <>
      <ConfigColumn
        desc={t('settings.desc.twoFA')}
        hasDivider={false}
        icon="tabler:lock-access"
        title={t('settings.title.twoFA')}
      >
        <div className="flex w-full items-center justify-between gap-4">
          <span className="text-bg-500">
            {userData.twoFAEnabled ? 'Enabled' : 'Disabled'}
          </span>
          <Switch
            checked={userData.twoFAEnabled}
            onChange={handleToggle2FAModal}
          />
        </div>
      </ConfigColumn>
    </>
  )
}

export default TwoFAColumn
