import { useTranslation } from 'react-i18next'

import { useAuth } from '@lifeforge/api'
import { ConfirmationModal, toast } from '@lifeforge/ui'

import forgeAPI from '@/forgeAPI'

function DisableTwoFAModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('common.accountSettings')
  const { setUserData } = useAuth()

  async function handleConfirm() {
    try {
      await forgeAPI.user['2fa'].disable.mutate(undefined)

      setUserData(userData =>
        userData ? { ...userData, twoFAEnabled: false } : null
      )
      toast.success(t('messages.twoFA.disableSuccess'))
      onClose()
    } catch {
      toast.error('Failed to disable 2FA')
    }
  }

  return (
    <ConfirmationModal
      data={{
        title: t('modals.disable2FA.title'),
        description: t('modals.disable2FA.description'),
        confirmationButton: 'confirm',
        onConfirm: handleConfirm
      }}
      onClose={onClose}
    />
  )
}

export default DisableTwoFAModal
