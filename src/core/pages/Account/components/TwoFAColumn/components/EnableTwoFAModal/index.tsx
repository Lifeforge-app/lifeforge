import clsx from 'clsx'
import React, { useState } from 'react'

import { ModalHeader, ModalWrapper } from '@lifeforge/ui'

import OTPScreen from '@security/components/OTPScreen'

import useComponentBg from '@hooks/useComponentBg'

import TwoFAEnableProcedure from './components/TwoFAEnableProcedure'

function EnableTwoFAModal({
  isOpen,
  onClose,
  onSuccess
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}): React.ReactElement {
  const [otpSuccess, setOtpSuccess] = useState(false)
  const { componentBgLighter } = useComponentBg()

  return (
    <ModalWrapper isOpen={isOpen}>
      <ModalHeader
        icon="tabler:lock-access"
        namespace="core.accountSettings"
        title="enable2FA"
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
        isOpen && <TwoFAEnableProcedure onSuccess={onSuccess} />
      )}
    </ModalWrapper>
  )
}

export default EnableTwoFAModal
