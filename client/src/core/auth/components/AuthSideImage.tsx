import { useTranslation } from 'react-i18next'

import { Box, Flex, Text, colorWithOpacity } from '@lifeforge/ui'

function AuthSideImage() {
  const { t } = useTranslation('common.auth')

  return (
    <Flex
      display={{ base: 'none', lg: 'flex' }}
      height="100%"
      position="relative"
      width="50%"
    >
      <img
        alt="Login"
        src="/assets/login.jpg"
        style={{
          height: '100%',
          objectFit: 'cover'
        }}
      />
      <div
        style={{
          background:
            'linear-gradient(to bottom right, var(--color-custom-100), var(--color-custom-900))',
          inset: 0,
          opacity: 0.5,
          position: 'absolute'
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
        <Text color="bg-50" size="5xl" tracking="wide" weight="semibold">
          {t('sideImageDesc.part2')}
        </Text>
      </Flex>
    </Flex>
  )
}

export default AuthSideImage
