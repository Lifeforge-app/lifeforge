import { useTranslation } from 'react-i18next'

import {
  Button,
  Flex,
  Icon,
  Stack,
  Text,
  colorWithOpacity
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
        bg={colorWithOpacity('custom-500', '20%')}
        height="5em"
        r="lg"
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
          namespace="common.auth"
          variant="secondary"
          width={{ base: '100%', sm: '50%' }}
          onClick={onClose}
        >
          qrLogin.deny
        </Button>
        <Button
          icon="tabler:check"
          loading={loading}
          namespace="common.auth"
          width={{ base: '100%', sm: '50%' }}
          onClick={onApprove}
        >
          qrLogin.approve
        </Button>
      </Flex>
    </Stack>
  )
}

export default ConfirmScreen
