import { useState } from 'react'
import type { ForgeAPIClientController } from 'shared'

import OTPScreen from './components/OTPScreen'

function WithOTP({
  controllers,
  children
}: {
  controllers?: {
    getChallenge: ForgeAPIClientController
    generateOTP: ForgeAPIClientController
    verifyOTP: ForgeAPIClientController
  }
  children: React.ReactNode
}) {
  const [otpSuccess, setOtpSuccess] = useState(false)

  if (!controllers) {
    return children
  }

  if (!otpSuccess) {
    return (
      <OTPScreen
        callback={() => setOtpSuccess(true)}
        controllers={controllers}
      />
    )
  }

  return children
}

export default WithOTP
