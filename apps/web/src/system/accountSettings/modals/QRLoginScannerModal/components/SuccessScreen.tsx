import { useTranslation } from 'react-i18next'

import {
  Button,
  Flex,
  Icon,
  Stack,
  Text,
  colorWithOpacity
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
        bg={colorWithOpacity('green-500', '20%')}
        height="5em"
        r="lg"
        width="5em"
      >
        <Icon color="green-500" icon="tabler:check" size="2.25em" />
      </Flex>

      <Text mt="lg" size="xl" weight="medium">
        {t('qrLogin.success')}
      </Text>
      {browserInfo && (
        <Text color="muted">
          {t('qrLogin.browserInfo')}: {browserInfo}
        </Text>
      )}

      <Button
        icon="tabler:arrow-right"
        iconPosition="end"
        mt="lg"
        variant="secondary"
        width="100%"
        onClick={onClose}
      >
        proceed
      </Button>
    </Stack>
  )
}

export default SuccessScreen
