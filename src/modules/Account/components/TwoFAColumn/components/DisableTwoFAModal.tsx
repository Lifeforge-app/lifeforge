import clsx from 'clsx'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { Button, ModalHeader, ModalWrapper } from '@lifeforge/ui'

import OTPScreen from '@security/components/OTPScreen'

import useComponentBg from '@hooks/useComponentBg'

import fetchAPI from '@utils/fetchAPI'

function DisableTwoFAModal({
  isOpen,
  onClose,
  onSuccess
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const { t } = useTranslation('modules.accountSettings')
  const { componentBgLighter } = useComponentBg()
  const [otpSuccess, setOtpSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onConfirm() {
    try {
      setLoading(true)
      await fetchAPI(`/user/2fa/disable`, {
        method: 'POST'
      })

      onSuccess()
    } catch {
      toast.error('Failed to disable 2FA')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalWrapper isOpen={isOpen}>
      <ModalHeader
        icon="tabler:lock-access-off"
        namespace="modules.accountSettings"
        title="disable2FA"
        onClose={onClose}
      />
      {!otpSuccess ? (
        <div
          className={clsx(
            'p-6 mt-6 rounded-lg shadow-custom',
            componentBgLighter
          )}
        >
          <OTPScreen
            buttonsFullWidth
            callback={() => {
              setOtpSuccess(true)
            }}
            endpoint="/user/2fa"
          />
        </div>
      ) : (
        <>
          <p className="text-bg-500">{t('modals.disable2FA.description')}</p>
          <div className="flex gap-2 w-full mt-6 sm:flex-row flex-col-reverse">
            <Button className="sm:w-1/2" icon="" onClick={onClose}>
              Cancel
            </Button>
            <Button
              isRed
              className="sm:w-1/2"
              icon="tabler:check"
              loading={loading}
              variant="secondary"
              onClick={onConfirm}
            >
              Confirm
            </Button>
          </div>
        </>
      )}
    </ModalWrapper>
  )
}

export default DisableTwoFAModal
