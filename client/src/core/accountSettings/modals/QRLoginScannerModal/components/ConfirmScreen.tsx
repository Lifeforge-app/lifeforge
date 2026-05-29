import { useTranslation } from 'react-i18next'

import {
  Button,
  COLORS,
  Flex,
  Icon,
  Stack,
  Text,
  withOpacity
} from '@lifeforge/ui'

function ConfirmScreen({
  onClose,
  onApprove,
  loading
}: {
  onClose: () => void
  onApprove: () => void
  loading: boolean
}) {
  const { t } = useTranslation('common.auth')

  return (
    <Stack align="center" gap="lg">
      <Flex
        centered
        height="5em"
        r="lg"
        style={{
          backgroundColor: withOpacity(COLORS['custom-500'], 0.2)
        }}
        width="5em"
      >
        <Icon color="primary" icon="tabler:device-laptop" size="2.25em" />
      </Flex>
      <Text align="center" mt="sm" size="xl" weight="medium">
        {t('qrLogin.approvalDescription')}
      </Text>
      <Flex
        direction={{ base: 'column-reverse', sm: 'row' }}
        gap="sm"
        mt="md"
        width="100%"
      >
        <Button
          dangerous
          icon="tabler:ban"
          variant="secondary"
          width={{ base: '100%', sm: '50%' }}
          onClick={onClose}
        >
          {t('qrLogin.deny')}
        </Button>
        <Button
          icon="tabler:check"
          loading={loading}
          width={{ base: '100%', sm: '50%' }}
          onClick={onApprove}
        >
          {t('qrLogin.approve')}
        </Button>
      </Flex>
    </Stack>
  )
}

export default ConfirmScreen
