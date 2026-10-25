import { useTranslation } from 'react-i18next'

import { Box, Flex, Image, Text, colorWithOpacity } from '@lifeforge/ui'

function AuthSideImage() {
  const { t } = useTranslation('common.auth')

  return (
    <Flex
      display={{ base: 'none', lg: 'flex' }}
      height="100%"
      position="relative"
      width="50%"
    >
      <Image alt="Login" fit="cover" height="100%" src="/assets/login.jpg" />
      <Box
        inset="0"
        position="absolute"
        style={{
          background:
            'linear-gradient(to bottom right, var(--color-custom-100), var(--color-custom-900))',
          opacity: 0.5
        }}
      />
      <Box
        bg={colorWithOpacity('bg-900', '50%')}
        position="absolute"
        style={{ inset: 0 }}
      />
      <Flex
        centered
        direction="column"
        position="absolute"
        style={{ inset: 0 }}
        width="100%"
      >
        <Text color="primary" mb="lg" size="2xl" tracking="wider">
          {t('sideImageDesc.part1')}
        </Text>
        <Text
          align="center"
          color="bg-50"
          size="5xl"
          tracking="wide"
          weight="semibold"
        >
          {t('sideImageDesc.part2')}
        </Text>
      </Flex>
    </Flex>
  )
}

export default AuthSideImage
