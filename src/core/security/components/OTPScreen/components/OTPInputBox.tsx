import OtpInput from 'react-otp-input'

import { Button } from '@lifeforge/ui'

function OTPInputBox({
  otp,
  setOtp,
  verityOTP,
  verifyOtpLoading
}: {
  otp: string
  setOtp: (otp: string) => void
  verityOTP: (otp: string) => Promise<void>
  verifyOtpLoading: boolean
}) {
  return (
    <>
      <OtpInput
        shouldAutoFocus
        numInputs={6}
        renderInput={props => (
          <input
            {...props}
            className="border-bg-200 bg-bg-50 text-bg-800 shadow-custom dark:border-bg-800 dark:bg-bg-900 dark:text-bg-200 mx-2 size-12! rounded-md border-[1.5px] text-lg md:size-16! md:text-2xl"
            inputMode="numeric"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                verityOTP(otp).catch(err => {
                  console.error(err)
                })
              }
            }}
          />
        )}
        value={otp}
        onChange={setOtp}
      />
      <Button
        iconAtEnd
        className="mt-6 w-full md:w-3/4 xl:w-1/2"
        icon="tabler:arrow-right"
        loading={verifyOtpLoading}
        namespace="common.vault"
        tKey="otp"
        onClick={() => {
          verityOTP(otp).catch(err => {
            console.error(err)
          })
        }}
      >
        verify
      </Button>
    </>
  )
}

export default OTPInputBox
