import { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Button, Flex, Grid, Text, useModalStore } from '@lifeforge/ui'

import QRLoginModal from '@/core/auth/modals/QRLoginModal'

import SignInButton from './components/SignInButton'
import SigninWithProviderButton from './components/SigninWithProviderButton'

function AuthSignInButton({
  loading,
  signIn,
  providers
}: {
  loading: boolean
  signIn: () => void
  providers: string[]
}) {
  const { t } = useTranslation('common.auth')

  const { open } = useModalStore()

  return (
    <Box mt="lg">
      <SignInButton loading={loading} signIn={signIn} />
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
      {providers.length > 0 && (
        <Grid
          gap="md"
          mb="md"
          templateCols="repeat(auto-fit, minmax(150px, 1fr))"
        >
          {providers.map(provider => (
            <SigninWithProviderButton
              key={provider}
              loading={loading}
              provider={provider}
            />
          ))}
        </Grid>
      )}
      <Button
        icon="tabler:qrcode"
        namespace="common.auth"
        variant="secondary"
        width="100%"
        onClick={() => open(QRLoginModal, {})}
      >
        qrLogin.title
      </Button>
    </Box>
  )
}

export default memo(AuthSignInButton)
