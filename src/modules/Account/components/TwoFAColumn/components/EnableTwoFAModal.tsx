import clsx from 'clsx'
import React, { useState } from 'react'

import { ModalHeader, ModalWrapper, OTPScreen } from '@lifeforge/ui'

import useComponentBg from '@hooks/useComponentBg'

function EnableTwoFAModal({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}): React.ReactElement {
  const [otpSuccess, setOtpSuccess] = useState(false)
  const { componentBgLighter } = useComponentBg()

  return (
    <ModalWrapper isOpen={isOpen}>
      <ModalHeader
        icon="tabler:lock-access"
        title="otp.enableTwoFA.title"
        onClose={onClose}
      />
      <div className={clsx('p-6', componentBgLighter)}>
        {!otpSuccess ? (
          <OTPScreen
            callback={() => {
              setOtpSuccess(true)
            }}
            endpoint="/user/2fa"
          />
        ) : (
          <div>Success</div>
        )}
      </div>
    </ModalWrapper>
  )
}

export default EnableTwoFAModal
