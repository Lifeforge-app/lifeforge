import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ConfigColumn, Switch } from '@lifeforge/ui'

import EnableTwoFAModal from './components/EnableTwoFAModal'

function TwoFAColumn() {
  const { t } = useTranslation('modules.accountSettings')
  const [isEnabled] = useState(false)
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
          {isEnabled ? 'Enabled' : 'Disabled'}
        </span>
        <Switch
          checked={false}
          onChange={() => {
            if (!isEnabled) {
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
      />
    </>
  )
}

export default TwoFAColumn
