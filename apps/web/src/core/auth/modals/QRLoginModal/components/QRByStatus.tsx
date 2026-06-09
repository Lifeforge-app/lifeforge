import { QRCodeSVG } from 'qrcode.react'
import { useTranslation } from 'react-i18next'

import {
  Box,
  Button,
  Icon,
  LoadingScreen,
  TAILWIND_PALETTE
} from '@lifeforge/ui'

export default function QRByStatus({
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
      return <LoadingScreen />
    case 'ready':
    case 'waiting':
      return qrData ? (
        <Box asChild height="100%" width="100%">
          <QRCodeSVG
            bgColor="transparent"
            fgColor="currentColor"
            level="M"
            value={qrData}
          />
        </Box>
      ) : null
    case 'approved':
      return (
        <Icon
          icon="tabler:check"
          size="2.5em"
          style={{ color: TAILWIND_PALETTE.green[500] }}
        />
      )
    case 'expired':
    case 'error':
      return (
        <Button
          dangerous
          icon="tabler:refresh"
          variant="secondary"
          width="100%"
          onClick={refreshSession}
        >
          {t('refresh')}
        </Button>
      )
    default:
      return null
  }
}
