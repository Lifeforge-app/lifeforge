import { Icon } from '@iconify/react'
import dayjs from 'dayjs'
import { Button, LoadingScreen } from 'lifeforge-ui'
import { QRCodeSVG } from 'qrcode.react'
import { useTranslation } from 'react-i18next'

import useQRLoginSession from '../hooks/useQRLoginSession'

function QRByStatus({
  status,
  qrData,
  refreshSession
}: {
  status: 'loading' | 'ready' | 'waiting' | 'approved' | 'expired' | 'error'
  qrData: string
  refreshSession: () => void
}) {
  const { t } = useTranslation('common.auth')

  switch (status) {
    case 'loading':
      return (
        <div className="flex-center size-full">
          <LoadingScreen />
        </div>
      )
    case 'ready':
    case 'waiting':
      return qrData ? (
        <QRCodeSVG
          bgColor="transparent"
          className="size-full"
          fgColor="currentColor"
          level="M"
          value={qrData}
        />
      ) : null
    case 'approved':
      return (
        <div className="flex-center size-full">
          <Icon className="size-10 text-green-500" icon="tabler:check" />
        </div>
      )
    case 'expired':
    case 'error':
      return (
        <Button
          dangerous
          className="w-full"
          icon="tabler:refresh"
          variant="secondary"
          onClick={refreshSession}
        >
          {t('refresh')}
        </Button>
      )
    default:
      return null
  }
}

function QRContent({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('common.auth')

  const { status, qrData, timeLeft, refreshSession } = useQRLoginSession({
    onSuccess: onClose
  })

  return (
    <>
      <div
        className={`flex-center relative aspect-square w-full rounded-lg border-2 p-6 transition-all ${
          status === 'expired'
            ? 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950'
            : status === 'approved'
              ? 'border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950'
              : 'border-bg-200 bg-bg-50 dark:border-bg-700 dark:bg-bg-800'
        }`}
      >
        <QRByStatus
          qrData={qrData}
          refreshSession={refreshSession}
          status={status}
        />
      </div>
      {(status === 'ready' || status === 'waiting') &&
        (() => (
          <>
            {timeLeft > 0 && (
              <p className="text-bg-400 mt-4 text-center text-sm">
                {dayjs.duration(timeLeft, 'second').format('mm:ss')}
              </p>
            )}
            <p className="text-bg-400 flex-center mt-4 gap-2 text-sm">
              <Icon className="size-4" icon="svg-spinners:ring-resize" />
              {t('qrLogin.waiting')}
            </p>
          </>
        ))()}
    </>
  )
}

export default QRContent
