import clsx from 'clsx'
import { Button } from 'lifeforge-ui'
import OtpInput from 'react-otp-input'

function OTPInputBox({
  otp,
  setOtp,
  verifyOTP,
  verifyOtpLoading,
  buttonFullWidth,
  lighter
}: {
  otp: string
  setOtp: (otp: string) => void
  verifyOTP: (otp: string) => Promise<void>
  verifyOtpLoading: boolean
  buttonFullWidth?: boolean
  lighter?: boolean
}) {
  return (
    <>
      <OtpInput
        shouldAutoFocus
        numInputs={6}
        renderInput={props => (
          <input
            {...props}
            className={clsx(
              'border-bg-200 text-bg-800 shadow-custom dark:border-bg-800 dark:text-bg-200 mx-2 size-12! rounded-md border-[1.5px] text-lg md:size-16! md:text-2xl',
              lighter ? 'component-bg-lighter' : 'component-bg'
            )}
            inputMode="numeric"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                verifyOTP(otp).catch(err => {
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
        className={clsx('mt-6 w-full', !buttonFullWidth && 'md:w-3/4 xl:w-1/2')}
        icon="tabler:arrow-right"
        iconPosition="end"
        loading={verifyOtpLoading}
        namespace="common.vault"
        onClick={() => {
          verifyOTP(otp).catch(err => {
            console.error(err)
          })
        }}
      >
        otp.buttons.verify
      </Button>
    </>
  )
}

export default OTPInputBox
