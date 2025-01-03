/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Icon } from '@iconify/react'
import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import OtpInput from 'react-otp-input'
import { toast } from 'react-toastify'
import Button from '@components/ButtonsAndInputs/Button'
import { encrypt } from '@utils/encryption'
import APIRequest from '@utils/fetchData'

function OTPScreen({
  verificationEndpoint,
  callback,
  fetchChallenge
}: {
  verificationEndpoint: string
  callback: () => void
  fetchChallenge: () => Promise<string>
}): React.ReactElement {
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpId, setOtpId] = useState(localStorage.getItem('otpId') ?? '')
  const [otpCooldown, setOtpCooldown] = useState(
    localStorage.getItem('otpCooldown')
      ? Math.floor(
          (Number(localStorage.getItem('otpCooldown')) - new Date().getTime()) /
            1000
        )
      : 0
  )
  const [sendOtpLoading, setSendOtpLoading] = useState(false)
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false)

  function requestOTP(): void {
    if (otpCooldown > 0) {
      toast.error(t('fetch.otp.cooldown'))
      return
    }

    setSendOtpLoading(true)
    APIRequest({
      method: 'GET',
      endpoint: 'user/auth/otp',
      callback: response => {
        setOtpSent(true)
        setOtpId(response.data)
        setOtpCooldown(60)
        const coolDown = new Date().getTime() + 60000
        localStorage.setItem('otpCooldown', coolDown.toString())
        toast.success(t('fetch.otp.success'))
      },
      onFailure: () => {
        toast.error(t('fetch.otp.failed'))
      },
      finalCallback: () => {
        setSendOtpLoading(false)
      }
    }).catch(err => {
      console.error(err)
    })
  }

  async function verityOTP(): Promise<void> {
    setVerifyOtpLoading(true)
    const challenge = await fetchChallenge()

    await APIRequest({
      endpoint: verificationEndpoint,
      method: 'POST',
      body: {
        otp: encrypt(otp, challenge),
        otpId
      },
      callback(data) {
        if (data.state === 'success' && data.data === true) {
          callback()
          localStorage.removeItem('otpCooldown')
          toast.success(t('fetch.otp.verify.success'))
        } else {
          toast.error(t('fetch.otp.verify.failed'))
        }
      },
      onFailure: () => {
        toast.error(t('fetch.otp.verify.failed'))
      },
      finalCallback: () => {
        setVerifyOtpLoading(false)
      }
    })
  }

  useEffect(() => {
    if (otpCooldown > 0) {
      setOtpSent(true)
      const interval = setInterval(() => {
        setOtpCooldown(prev => prev - 1)

        if (otpCooldown === 0) {
          setOtpSent(false)
          clearInterval(interval)
        }
      }, 1000)
      return () => {
        clearInterval(interval)
      }
    }
  }, [otpCooldown, otpSent])

  return (
    <div className="flex-center size-full flex-1 flex-col gap-4">
      <Icon icon="tabler:shield-lock" className="size-28" />
      <h2 className="text-center text-4xl font-semibold">
        {t('fetch.otp.required.title')}
      </h2>
      <p className="mb-8 text-center text-lg text-bg-500">
        {t('fetch.otp.required.desc')}
      </p>
      {otpSent ? (
        <>
          <OtpInput
            shouldAutoFocus
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderInput={props => (
              <input
                {...props}
                className="mx-2 !size-12 rounded-md border-[1.5px] border-bg-200 bg-bg-50 text-lg !text-bg-800 shadow-custom dark:border-bg-800 dark:bg-bg-900 dark:text-bg-50 md:!size-16 md:text-2xl"
              />
            )}
          />
          <Button
            onClick={() => {
              verityOTP().catch(err => {
                console.error(err)
              })
            }}
            loading={verifyOtpLoading}
            className="mt-6 w-full md:w-3/4 xl:w-1/2"
            icon="tabler:arrow-right"
            iconAtEnd
          >
            Verify OTP
          </Button>
          <Button
            onClick={requestOTP}
            loading={sendOtpLoading}
            disabled={otpCooldown > 0}
            className="w-full md:w-3/4 xl:w-1/2"
            variant="secondary"
            icon="tabler:refresh"
            needTranslate={false}
          >
            {t('button.resendOtp')} {otpCooldown > 0 && `(${otpCooldown}s)`}
          </Button>
        </>
      ) : (
        <Button
          onClick={requestOTP}
          loading={sendOtpLoading}
          className="w-full md:w-3/4 xl:w-1/2"
          icon="tabler:mail"
        >
          Request OTP
        </Button>
      )}
    </div>
  )
}

export default OTPScreen
