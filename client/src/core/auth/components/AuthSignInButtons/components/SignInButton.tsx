import { memo } from 'react'

import { useAuth } from '@/providers/AuthProvider'
import { Button } from '@lifeforge/ui'

function SignInButton({
  loading,
  signIn
}: {
  loading: boolean
  signIn: () => void
}) {
  const { auth } = useAuth()

  return (
    <Button
      icon="tabler:arrow-right"
      iconPosition="end"
      loading={loading || auth}
      namespace="common.auth"
      width="100%"
      onClick={signIn}
    >
      Sign In
    </Button>
  )
}

export default memo(SignInButton)
