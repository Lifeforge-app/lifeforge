import { Button } from '@components/buttons'
import { Icon } from '@iconify/react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import type { ForgeAPIClientController } from 'shared'
import { encrypt } from 'shared'

import OTPInputBox from './components/OTPInputBox'
import ResendOTPButton from './components/ResendOTPButton'

function OTPScreen({
  controllers,
  callback
}: {
  controllers: {
    getChallenge: ForgeAPIClientController
    generateOTP: ForgeAPIClientController
    verifyOTP: ForgeAPIClientController
  }
  callback: () => void
}) {
  const { t } = useTranslation('common.vault')

  const [otpSent, setOtpSent] = useState(false)

  const [otpId, setOtpId] = useState(
    localStorage.getItem(`otpId:${controllers.verifyOTP.endpoint}`) ?? ''
  )

  const [otpCooldown, setOtpCooldown] = useState(
    localStorage.getItem(`otpCooldown:${controllers.verifyOTP.endpoint}`)
      ? Math.floor(
          (Number(
            localStorage.getItem(
              `otpCooldown:${controllers.verifyOTP.endpoint}`
            )
          ) -
            new Date().getTime()) /
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
      const data = (await controllers.generateOTP.query()) as string

      setOtpSent(true)
      setOtpId(data)
      setOtpCooldown(60)

      const coolDown = new Date().getTime() + 60000

      localStorage.setItem(`otpId:${controllers.verifyOTP.endpoint}`, data)
      localStorage.setItem(
        `otpCooldown:${controllers.verifyOTP.endpoint}`,
        coolDown.toString()
      )
      toast.success(t('otp.messages.success'))
    } catch {
      toast.error(t('otp.messages.failed'))
    } finally {
      setSendOtpLoading(false)
    }
  }

  const verifyOTP = useCallback(
    async (otp: string): Promise<void> => {
      if (otp.length !== 6) {
        toast.error(t('otp.messages.invalid'))

        return
      }

      setVerifyOtpLoading(true)

      try {
        const challenge = (await controllers.getChallenge.query()) as string

        const data = (await controllers.verifyOTP.mutate({
          otp: encrypt(otp, challenge),
          otpId
        } as never)) as boolean

        if (data) {
          callback()
          localStorage.removeItem(
            `otpCooldown:${controllers.verifyOTP.endpoint}`
          )
          toast.success(t('otp.messages.verify.success'))
        } else {
          toast.error(t('otp.messages.verify.failed'))
        }
      } catch {
        toast.error(t('otp.messages.verify.failed'))
      } finally {
        setVerifyOtpLoading(false)
      }
    },
    [otpId]
  )

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
      <div className="flex-center size-full flex-1 flex-col gap-3">
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
              verifyOTP={verifyOTP}
              verifyOtpLoading={verifyOtpLoading}
            />
            <ResendOTPButton
              otpCooldown={otpCooldown}
              sendOtpLoading={sendOtpLoading}
              onClick={requestOTP}
            />
          </>
        ) : (
          <>
            <Button
              className="w-full md:w-3/4 xl:w-1/2"
              icon="tabler:mail"
              loading={sendOtpLoading}
              namespace="common.vault"
              onClick={requestOTP}
            >
              otp.buttons.request
            </Button>
          </>
        )}
      </div>
    </>
  )
}

export default OTPScreen
