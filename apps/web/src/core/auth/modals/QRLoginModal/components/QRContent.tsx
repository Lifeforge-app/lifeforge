import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useTranslation } from 'react-i18next'

import {
  Bordered,
  Flex,
  Icon,
  Text,
  Transition,
  colorWithOpacity
} from '@lifeforge/ui'

import useQRLoginSession, { type QRStatus } from '../hooks/useQRLoginSession'
import QRByStatus from './QRByStatus'

dayjs.extend(duration)

const STYLES = {
  expired: {
    border: colorWithOpacity('red-500', '70%'),
    bg: colorWithOpacity('red-500', '20%')
  },
  approved: {
    border: colorWithOpacity('green-500', '70%'),
    bg: colorWithOpacity('green-500', '20%')
  },
  default: {
    bg: colorWithOpacity('bg-500', '20%'),
    border: colorWithOpacity('bg-500', '70%')
  }
} as const

const getStyle = (status: QRStatus) => {
  if (status in STYLES) {
    return STYLES[status as keyof typeof STYLES]
  }

  return STYLES.default
}

function QRContent({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('common.auth')
  const { status, qrData, timeLeft, refreshSession } = useQRLoginSession({
    onSuccess: onClose
  })

  return (
    <>
      <Transition>
        <Bordered asChild borderWidth="2px" {...getStyle(status)}>
          <Flex
            centered
            p="lg"
            r="lg"
            style={{ aspectRatio: '1/1' }}
            width="100%"
          >
            <QRByStatus
              qrData={qrData}
              refreshSession={refreshSession}
              status={status}
            />
          </Flex>
        </Bordered>
      </Transition>
      {(status === 'ready' || status === 'waiting') &&
        (() => (
          <>
            {timeLeft > 0 && (
              <Text align="center" color="muted" mt="md" size="sm">
                {dayjs.duration(timeLeft, 'second').format('mm:ss')}
              </Text>
            )}
            <Flex asChild centered gap="sm" mt="md">
              <Text color="muted" size="sm">
                <Icon icon="svg-spinners:ring-resize" />
                {t('qrLogin.waiting')}
              </Text>
            </Flex>
          </>
        ))()}
    </>
  )
}

export default QRContent
