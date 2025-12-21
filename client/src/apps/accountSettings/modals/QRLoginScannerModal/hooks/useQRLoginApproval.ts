import forgeAPI from '@/utils/forgeAPI'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { usePromiseLoading } from 'shared'

interface QRSessionData {
  type: 'lifeforge-qr-login'
  v: number
  sessionId: string
}

type ModalStep = 'confirm' | 'success' | 'error'

function useQRLoginApproval(scannedData: string) {
  const { t } = useTranslation('common.auth')

  const [step, setStep] = useState<ModalStep>('confirm')

  const [browserInfo, setBrowserInfo] = useState<string>('')

  const [errorMessage, setErrorMessage] = useState<string>('')

  const parseSessionData = (): QRSessionData | null => {
    try {
      const parsed = JSON.parse(scannedData) as QRSessionData

      if (parsed.type !== 'lifeforge-qr-login' || parsed.v !== 1) {
        return null
      }

      if (!parsed.sessionId) {
        return null
      }

      return parsed
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
      const response = await forgeAPI.user.qrLogin.approveQRLogin.mutate({
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
