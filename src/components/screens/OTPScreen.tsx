import { Icon } from '@iconify/react'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import OtpInput from 'react-otp-input'
import { toast } from 'react-toastify'
import { Button } from '@components/buttons'
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
  const { t } = useTranslation('common.vault')
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
      toast.error(t('otp.messages.cooldown'))
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
        toast.success(t('otp.messages.success'))
      },
      onFailure: () => {
        toast.error(t('otp.messages.failed'))
      },
      finalCallback: () => {
        setSendOtpLoading(false)
      }
    }).catch(err => {
      console.error(err)
    })
  }

  async function verityOTP(): Promise<void> {
    if (otp.length !== 6) {
      toast.error(t('otp.messages.invalid'))
      return
    }

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
          toast.success(t('otp.messages.verify.success'))
        } else {
          toast.error(t('otp.messages.verify.failed'))
        }
      },
      onFailure: () => {
        toast.error(t('otp.messages.verify.failed'))
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
      <Icon className="size-28" icon="tabler:shield-lock" />
      <h2 className="text-center text-4xl font-semibold">
        {t('otp.messages.required.title')}
      </h2>
      <p className="mb-8 text-center text-lg text-bg-500">
        {t('otp.messages.required.desc')}
      </p>
      {otpSent ? (
        <>
          <OtpInput
            shouldAutoFocus
            numInputs={6}
            renderInput={props => (
              <input
                {...props}
                className="mx-2 size-12! rounded-md border-[1.5px] border-bg-200 bg-bg-50 text-lg text-bg-800! shadow-custom dark:border-bg-800 dark:bg-bg-900 dark:text-bg-50 md:size-16! md:text-2xl"
                inputMode="numeric"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    verityOTP().catch(err => {
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
              verityOTP().catch(err => {
                console.error(err)
              })
            }}
          >
            verify
          </Button>
          <Button
            className="w-full md:w-3/4 xl:w-1/2"
            disabled={otpCooldown > 0}
            icon="tabler:refresh"
            loading={sendOtpLoading}
            variant="secondary"
            onClick={requestOTP}
          >
            {t('otp.buttons.resend')} {otpCooldown > 0 && `(${otpCooldown}s)`}
          </Button>
        </>
      ) : (
        <Button
          className="w-full md:w-3/4 xl:w-1/2"
          icon="tabler:mail"
          loading={sendOtpLoading}
          namespace="common.vault"
          tKey="otp"
          onClick={requestOTP}
        >
          Request
        </Button>
      )}
    </div>
  )
}

export default OTPScreen
