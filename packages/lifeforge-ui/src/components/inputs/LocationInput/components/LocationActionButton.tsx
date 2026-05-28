import { Icon } from '@iconify/react'
import { useTranslation } from 'react-i18next'

import { Box, Text } from '@components/primitives'

import { Tooltip } from '../../../utilities'

export function LocationActionButton({
  enabled
}: {
  enabled: boolean | 'loading'
}) {
  const { t } = useTranslation('common.misc')

  const showInfoIcon = !enabled || enabled === 'loading'

  if (!showInfoIcon) return null

  if (enabled === 'loading') {
    return (
      <Text asChild color={{ base: 'bg-500' }}>
        <Icon
          height="1.2rem"
          icon="svg-spinners:ring-resize"
          width="1.2rem"
        />
      </Text>
    )
  }

  return (
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
            color="custom-500"
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
  )
}

