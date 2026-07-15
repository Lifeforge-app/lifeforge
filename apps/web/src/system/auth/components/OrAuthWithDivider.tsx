import { useTranslation } from 'react-i18next'

import { Box, Flex, Text } from '@lifeforge/ui'

function OrAuthWithDivider() {
  const { t } = useTranslation('common.auth')

  return (
    <Flex centered gap="md" my="lg">
      <Box
        bg={{ base: 'bg-400', dark: 'bg-700' }}
        height="1.5px"
        width="100%"
      />
      <Box asChild flexShrink="0">
        <Text color={{ base: 'bg-400', dark: 'bg-700' }} weight="medium">
          {t('orAuthenticateWith')}
        </Text>
      </Box>
      <Box
        bg={{ base: 'bg-400', dark: 'bg-700' }}
        height="1.5px"
        width="100%"
      />
    </Flex>
  )
}

export default OrAuthWithDivider
