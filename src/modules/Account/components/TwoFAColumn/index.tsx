import { useAuth } from '@providers/AuthProvider'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ConfigColumn, Switch } from '@lifeforge/ui'

import EnableTwoFAModal from './components/EnableTwoFAModal'

function TwoFAColumn() {
  const { t } = useTranslation('modules.accountSettings')
  const { userData, setUserData } = useAuth()
  const [enableTwoFAModalOpen, setEnableTwoFAModalOpen] = useState(false)

  return (
    <>
      <ConfigColumn
        desc={t('settings.desc.twoFA')}
        hasDivider={false}
        icon="tabler:lock-access"
        title={t('settings.title.twoFA')}
      >
        <span className="text-bg-500">
          {userData.twoFAEnabled ? 'Enabled' : 'Disabled'}
        </span>
        <Switch
          checked={userData.twoFAEnabled}
          onChange={() => {
            if (!userData.twoFAEnabled) {
              setEnableTwoFAModalOpen(true)
            }
          }}
        />
      </ConfigColumn>
      <EnableTwoFAModal
        isOpen={enableTwoFAModalOpen}
        onClose={() => {
          setEnableTwoFAModalOpen(false)
        }}
        onSuccess={() => {
          setEnableTwoFAModalOpen(false)
          setUserData({
            ...userData,
            twoFAEnabled: true
          })
        }}
      />
    </>
  )
}

export default TwoFAColumn
