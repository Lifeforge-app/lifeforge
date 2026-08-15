import { useTranslation } from 'react-i18next'

import { Button, OptionsColumn, useModalStore } from '@lifeforge/ui'

import ChangePasswordModal from '@/system/accountSettings/modals/ChangePasswordModal'

function PasswordColumn() {
  const { t } = useTranslation('common.account-settings')
  const { open } = useModalStore()

  return (
    <OptionsColumn
      description={t('settings.desc.password')}
      icon="tabler:key"
      title={t('settings.title.password')}
    >
      <Button
        icon="tabler:key"
        namespace="common.account-settings"
        variant="secondary"
        width={{ base: '100%', md: 'auto' }}
        onClick={() => open(ChangePasswordModal, {})}
      >
        change password
      </Button>
    </OptionsColumn>
  )
}

export default PasswordColumn
