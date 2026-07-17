import { useTranslation } from 'react-i18next'

import { Tooltip } from '@/components/feedback'
import { Box, Flex, Icon, Text } from '@/components/primitives'

export function LocationServiceStatusIndicator({
  enabled
}: {
  enabled: boolean | 'loading'
}) {
  const { t } = useTranslation('common.misc')

  const showInfoIcon = !enabled || enabled === 'loading'

  if (!showInfoIcon) return null

  if (enabled === 'loading') {
    return (
      <Flex centered height="100%">
        <Icon color={{ base: 'bg-500' }} icon="svg-spinners:ring-resize" />
      </Flex>
    )
  }

  return (
    <Flex centered height="100%">
      <Tooltip
        clickable={true}
        icon="tabler:info-circle"
        id="location-disabled"
        place="top-end"
        positionStrategy="fixed"
      >
        <Box maxWidth="16rem">
          <Text color={{ base: 'bg-500' }}>
            {t('locationDisabled.description')}{' '}
            <Text
              as="a"
              color="primary"
              decoration="underline"
              href="https://docs.lifeforge.melvinchia.dev/user-guide/api-keys#location"
              rel="noopener noreferrer"
              style={{ textDecorationThickness: '2px' }}
              target="_blank"
              weight="medium"
            >
              API Keys Guide
            </Text>
          </Text>
        </Box>
      </Tooltip>
    </Flex>
  )
}
