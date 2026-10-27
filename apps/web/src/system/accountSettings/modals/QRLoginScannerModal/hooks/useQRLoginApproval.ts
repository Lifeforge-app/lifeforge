import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { usePromiseLoading } from '@lifeforge/api'
import { toast } from '@lifeforge/ui'

import forgeAPI from '@/core/utils/forgeAPI'

interface QRSessionData {
  type: 'lifeforge-qr-login'
  v: number
  sessionId: string
}

function isQRSessionData(value: unknown): value is QRSessionData {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    value.type === 'lifeforge-qr-login' &&
    'v' in value &&
    value.v === 1 &&
    'sessionId' in value &&
    typeof value.sessionId === 'string' &&
    value.sessionId.length > 0
  )
}

type ModalStep = 'confirm' | 'success' | 'error'

function useQRLoginApproval(scannedData: string) {
  const { t } = useTranslation('common.auth')
  const [step, setStep] = useState<ModalStep>('confirm')
  const [browserInfo, setBrowserInfo] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const parseSessionData = (): QRSessionData | null => {
    try {
      const parsed: unknown = JSON.parse(scannedData)

      return isQRSessionData(parsed) ? parsed : null
    } catch {
      return null
    }
  }

  const sessionData = parseSessionData()

  if (!sessionData && step === 'confirm') {
    setTimeout(() => {
      setErrorMessage(t('qrLogin.invalidQR'))
      setStep('error')
    }, 0)
  }

  const handleApprove = async () => {
    if (!sessionData) return

    try {
      const response = await forgeAPI.auth.qrLogin.approve.mutateRaw({
        sessionId: sessionData.sessionId
      })

      setBrowserInfo(response.browserInfo)
      setStep('success')
      toast.success(t('qrLogin.success'))
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          setErrorMessage(t('qrLogin.sessionNotFound'))
        } else if (error.message.includes('already approved')) {
          setErrorMessage(t('qrLogin.alreadyApproved'))
        } else {
          setErrorMessage(error.message)
        }
      } else {
        setErrorMessage(t('messages.unknownError'))
      }

      setStep('error')
    }
  }

  const [loading, onApprove] = usePromiseLoading(handleApprove)

  return {
    step,
    browserInfo,
    errorMessage,
    loading,
    onApprove
  }
}

export default useQRLoginApproval
