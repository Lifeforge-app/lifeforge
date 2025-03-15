import clsx from 'clsx'
import React, { useState } from 'react'

import { ModalHeader, ModalWrapper, OTPScreen } from '@lifeforge/ui'

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
  const [otpSuccess, setOtpSuccess] = useState(true)
  const { componentBgLighter } = useComponentBg()

  return (
    <ModalWrapper isOpen={isOpen}>
      <ModalHeader
        icon="tabler:lock-access"
        namespace="modules.accountSettings"
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
