import { useTranslation } from 'react-i18next'

import {
  Button,
  Flex,
  Icon,
  Stack,
  TAILWIND_PALETTE,
  Text,
  withOpacity
} from '@lifeforge/ui'

function SuccessScreen({
  onClose,
  browserInfo
}: {
  onClose: () => void
  browserInfo: string
}) {
  const { t } = useTranslation('common.auth')

  return (
    <Stack align="center">
      <Flex
        centered
        height="5em"
        r="lg"
        style={{
          backgroundColor: withOpacity(TAILWIND_PALETTE.green[500], 0.2)
        }}
        width="5em"
      >
        <Icon
          icon="tabler:check"
          size="2.25em"
          style={{
            color: TAILWIND_PALETTE.green[500]
          }}
        />
      </Flex>

      <Text size="xl" weight="medium">
        {t('qrLogin.success')}
      </Text>
      {browserInfo && (
        <Text color="muted">
          {t('qrLogin.browserInfo')}: {browserInfo}
        </Text>
      )}

      <Button
        icon="tabler:x"
        mt="lg"
        variant="secondary"
        width="100%"
        onClick={onClose}
      >
        Close
      </Button>
    </Stack>
  )
}

export default SuccessScreen
