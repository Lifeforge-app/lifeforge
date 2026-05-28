import { useTranslation } from 'react-i18next'

import { Box, Flex, Icon, Text } from '@lifeforge/ui'

function AuthHeader() {
  const { t } = useTranslation('common.auth')

  return (
    <>
      <Flex asChild align="center" gap="sm" mb="lg">
        <Text as="h1" size="3xl" weight="semibold" whiteSpace="nowrap">
          <Icon color="custom-500" icon="tabler:hammer" size="5xl" />
          <Box>
            LifeForge
            <Text color="custom-500" size="4xl">
              .
            </Text>
          </Box>
        </Text>
      </Flex>
      <Text
        align="center"
        as="h2"
        size={{ base: '4xl', sm: '5xl' }}
        tracking="wide"
        weight="semibold"
      >
        {t('header')}
      </Text>
      <Text
        align="center"
        as="p"
        color="bg-500"
        mt={{ base: 'sm', sm: 'md' }}
        size={{ base: 'base', sm: 'xl' }}
      >
        {t('desc')}
      </Text>
    </>
  )
}

export default AuthHeader
