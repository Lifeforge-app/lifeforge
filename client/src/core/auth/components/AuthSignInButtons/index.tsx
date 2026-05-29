import { memo } from 'react'

import { Box, Button, Grid, useModalStore } from '@lifeforge/ui'

import QRLoginModal from '@/core/auth/modals/QRLoginModal'

import OrAuthWithDivider from '../OrAuthWithDivider'
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
  const { open } = useModalStore()

  return (
    <Box mt="lg">
      <SignInButton loading={loading} signIn={signIn} />
      <OrAuthWithDivider />
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
