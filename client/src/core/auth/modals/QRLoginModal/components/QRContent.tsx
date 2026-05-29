import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { useTranslation } from 'react-i18next'

import {
  Bordered,
  COLORS,
  Flex,
  Icon,
  TAILWIND_PALETTE,
  Text,
  Transition,
  withOpacity
} from '@lifeforge/ui'

import useQRLoginSession from '../hooks/useQRLoginSession'
import QRByStatus from './QRByStatus'

dayjs.extend(duration)

function QRContent({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('common.auth')

  const { status, qrData, timeLeft, refreshSession } = useQRLoginSession({
    onSuccess: onClose
  })

  return (
    <>
      <Transition>
        <Bordered
          asChild
          borderWidth="2px"
          style={{
            borderColor:
              status === 'expired'
                ? withOpacity(TAILWIND_PALETTE.red['500'], 0.7)
                : status === 'approved'
                  ? withOpacity(TAILWIND_PALETTE.green['500'], 0.7)
                  : withOpacity(COLORS['bg-500'], 0.7)
          }}
        >
          <Flex
            centered
            p="lg"
            r="lg"
            style={{
              backgroundColor:
                status === 'expired'
                  ? withOpacity(TAILWIND_PALETTE.red['500'], 0.2)
                  : status === 'approved'
                    ? withOpacity(TAILWIND_PALETTE.green['500'], 0.2)
                    : withOpacity(COLORS['bg-500'], 0.2),
              aspectRatio: '1/1'
            }}
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
