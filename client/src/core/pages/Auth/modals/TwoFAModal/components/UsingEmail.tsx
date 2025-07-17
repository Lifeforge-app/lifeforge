import { Button, TextInput } from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import OTPInputBox from '@security/components/OTPScreen/components/OTPInputBox'
import ResendOTPButton from '@security/components/OTPScreen/components/ResendOTPButton'

import fetchAPI from '@utils/fetchAPI'

import { useAuth } from '../../../../../providers/AuthProvider'

function UsingEmail({
  callback
}: {
  callback: (otp: string) => Promise<void>
}) {
  const { tid } = useAuth()
  const { t } = useTranslation('common.auth')
  const [otp, setOTP] = useState('')
  const [email, setEmail] = useState('')
  const [sendOtpLoading, setSendOtpLoading] = useState(false)
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpCooldown, setOtpCooldown] = useState(
    localStorage.getItem(`otpCooldown:2fa`)
      ? Math.floor(
          (Number(localStorage.getItem(`otpCooldown:2fa`)) -
            new Date().getTime()) /
            1000
        )
      : 0
  )

  async function requestOTP(): Promise<void> {
    if (otpCooldown > 0) {
      toast.error(t('otp.messages.cooldown'))
      return
    }

    setOTP('')
    setSendOtpLoading(true)

    try {
      const res = await fetchAPI<string>(
        `user/2fa/otp?email=${encodeURIComponent(email)}`,
        {
          method: 'GET'
        }
      )

      tid.current = res
      setOtpSent(true)
      setOtpCooldown(60)
      const coolDown = new Date().getTime() + 60000
      localStorage.setItem(`otpId:2fa`, res)
      localStorage.setItem(`otpCooldown:2fa`, coolDown.toString())
      toast.success(t('messages.otpSent'))
    } catch {
      toast.error(t('otp.messages.failed'))
    } finally {
      setSendOtpLoading(false)
    }
  }

  useEffect(() => {
    if (otpCooldown > 0) {
      setOtpSent(true)
      const existedTid = localStorage.getItem(`otpId:2fa`)
      if (existedTid) {
        tid.current = existedTid
      }
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
    <>
      <p className="mb-6">{t('modals.twoFA.emailDescription')}</p>
      <div className="flex-center w-full flex-col">
        {otpSent ? (
          <div className="space-y-4">
            <OTPInputBox
              buttonFullWidth
              lighter
              otp={otp}
              setOtp={setOTP}
              verifyOTP={async otp => {
                setVerifyOtpLoading(true)
                callback(otp).finally(() => {
                  setVerifyOtpLoading(false)
                })
              }}
              verifyOtpLoading={verifyOtpLoading}
            />
            <ResendOTPButton
              buttonFullWidth
              otpCooldown={otpCooldown}
              sendOtpLoading={sendOtpLoading}
              onClick={() => {
                setEmail('')
                setOtpSent(false)
                setOtpCooldown(0)
                localStorage.removeItem(`otpId:2fa`)
                localStorage.removeItem(`otpCooldown:2fa`)
              }}
            />
          </div>
        ) : (
          <>
            <TextInput
              darker
              className="mb-4 w-full"
              icon="tabler:mail"
              inputMode="email"
              name="email"
              namespace="common.auth"
              placeholder="johndoe@gmail.com"
              setValue={setEmail}
              tKey="modals.twoFA"
              value={email}
            />
            <Button
              className="w-full"
              icon="tabler:mail"
              loading={sendOtpLoading}
              namespace="common.vault"
              tKey="otp"
              onClick={requestOTP}
            >
              Request
            </Button>
          </>
        )}
      </div>
    </>
  )
}

export default UsingEmail
