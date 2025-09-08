import forgeAPI from '@utils/forgeAPI'
import { Button, ModalHeader, WithOTP } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { usePromiseLoading } from 'shared'

import { useAuth } from '../../../../core/providers/AuthProvider'

function DisableTwoFAModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('apps.accountSettings')

  const { setUserData } = useAuth()

  async function handleConfirm() {
    try {
      await forgeAPI.user['2fa'].disable.mutate({})

      setUserData(userData =>
        userData ? { ...userData, twoFAEnabled: false } : null
      )
      toast.success(t('messages.twoFA.disableSuccess'))
      onClose()
    } catch {
      toast.error('Failed to disable 2FA')
    }
  }

  const [loading, onConfirm] = usePromiseLoading(handleConfirm)

  return (
    <div>
      <ModalHeader
        icon="tabler:lock-access-off"
        namespace="apps.accountSettings"
        title="disable2FA"
        onClose={onClose}
      />
      <WithOTP
        controllers={{
          getChallenge: forgeAPI.user['2fa'].getChallenge,
          verifyOTP: forgeAPI.user['2fa'].validateOTP,
          generateOTP: forgeAPI.user.auth.generateOTP
        }}
      >
        <p className="text-bg-500">{t('modals.disable2FA.description')}</p>
        <div className="mt-6 flex w-full flex-col-reverse gap-2 sm:flex-row">
          <Button className="sm:w-1/2" icon="" onClick={onClose}>
            Cancel
          </Button>
          <Button
            dangerous
            className="sm:w-1/2"
            icon="tabler:check"
            loading={loading}
            variant="secondary"
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </div>
      </WithOTP>
    </div>
  )
}

export default DisableTwoFAModal
