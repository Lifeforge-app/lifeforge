import { Button } from 'lifeforge-ui'
import { memo } from 'react'

import { useAuth } from '../../../../../providers/AuthProvider'

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
      iconAtEnd
      className="w-full"
      icon="tabler:arrow-right"
      loading={loading || auth}
      namespace="common.auth"
      onClick={signIn}
    >
      Sign In
    </Button>
  )
}

export default memo(SignInButton)
