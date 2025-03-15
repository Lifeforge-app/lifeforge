import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { Button } from '@lifeforge/ui'

import fetchAPI from '@utils/fetchAPI'

import { encrypt } from '../../utils/encryption'
import OTPInputBox from './components/OTPInputBox'
import ResendOTPButton from './components/ResendOTPButton'

function OTPScreen({
  endpoint,
  callback
}: {
  endpoint: string
  callback: () => void
}) {
  const { t } = useTranslation('common.vault')
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
  const [otp, setOtp] = useState('')

  async function requestOTP(): Promise<void> {
    if (otpCooldown > 0) {
      toast.error(t('otp.messages.cooldown'))
      return
    }

    setOtp('')
    setSendOtpLoading(true)

    try {
      const data = await fetchAPI<string>('user/auth/otp', {
        method: 'GET'
      })

      setOtpSent(true)
      setOtpId(data)
      setOtpCooldown(60)
      const coolDown = new Date().getTime() + 60000
      localStorage.setItem('otpCooldown', coolDown.toString())
      toast.success(t('otp.messages.success'))
    } catch {
      toast.error(t('otp.messages.failed'))
    } finally {
      setSendOtpLoading(false)
    }
  }

  async function verityOTP(otp: string): Promise<void> {
    if (otp.length !== 6) {
      toast.error(t('otp.messages.invalid'))
      return
    }

    setVerifyOtpLoading(true)

    try {
      const challenge = await fetchAPI<string>(`${endpoint}/challenge`)

      const data = await fetchAPI<boolean>(`${endpoint}/otp`, {
        method: 'POST',
        body: {
          otp: encrypt(otp, challenge),
          otpId
        }
      })

      if (data) {
        callback()
        localStorage.removeItem('otpCooldown')
        toast.success(t('otp.messages.verify.success'))
      } else {
        toast.error(t('otp.messages.verify.failed'))
      }
    } catch {
      toast.error(t('otp.messages.verify.failed'))
    } finally {
      setVerifyOtpLoading(false)
    }
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
    <>
      <div className="flex-center size-full flex-1 flex-col gap-4">
        <Icon className="size-28" icon="tabler:shield-lock" />
        <h2 className="text-center text-4xl font-semibold">
          {t('otp.messages.required.title')}
        </h2>
        <p className="text-bg-500 mb-8 text-center text-lg">
          {t('otp.messages.required.desc')}
        </p>
        {otpSent ? (
          <>
            <OTPInputBox
              otp={otp}
              setOtp={setOtp}
              verifyOTP={verityOTP}
              verifyOtpLoading={verifyOtpLoading}
            />
            <ResendOTPButton
              otpCooldown={otpCooldown}
              requestOTP={requestOTP}
              sendOtpLoading={sendOtpLoading}
            />
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </>
  )
}

export default OTPScreen
