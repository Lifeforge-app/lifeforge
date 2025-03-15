import { useAuth } from '@providers/AuthProvider'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { ConfigColumn, Switch } from '@lifeforge/ui'

import DisableTwoFAModal from './components/DisableTwoFAModal'
import EnableTwoFAModal from './components/EnableTwoFAModal'

function TwoFAColumn() {
  const { t } = useTranslation('modules.accountSettings')
  const { userData, setUserData } = useAuth()
  const [toggleTwoFAModalOpen, setToggleTwoFAModalOpen] = useState(false)

  return (
    <>
      <ConfigColumn
        desc={t('settings.desc.twoFA')}
        hasDivider={false}
        icon="tabler:lock-access"
        title={t('settings.title.twoFA')}
      >
        <div className="w-full flex items-center justify-between gap-4">
          <span className="text-bg-500">
            {userData.twoFAEnabled ? 'Enabled' : 'Disabled'}
          </span>
          <Switch
            checked={userData.twoFAEnabled}
            onChange={() => {
              setToggleTwoFAModalOpen(true)
            }}
          />
        </div>
      </ConfigColumn>
      {userData.twoFAEnabled ? (
        <DisableTwoFAModal
          isOpen={toggleTwoFAModalOpen}
          onClose={() => setToggleTwoFAModalOpen(false)}
          onSuccess={() => {
            setToggleTwoFAModalOpen(false)
            setUserData({ ...userData, twoFAEnabled: false })
          }}
        />
      ) : (
        <EnableTwoFAModal
          isOpen={toggleTwoFAModalOpen}
          onClose={() => {
            setToggleTwoFAModalOpen(false)
            toast.info(t('messages.twoFA.disableSuccess'))
          }}
          onSuccess={() => {
            setToggleTwoFAModalOpen(false)
            setUserData({
              ...userData,
              twoFAEnabled: true
            })
            toast.success(t('messages.twoFA.enableSuccess'))
          }}
        />
      )}
    </>
  )
}

export default TwoFAColumn
