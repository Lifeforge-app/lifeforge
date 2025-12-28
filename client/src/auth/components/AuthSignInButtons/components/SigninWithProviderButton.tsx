import { Button } from 'lifeforge-ui'
import _ from 'lodash'
import { memo } from 'react'
import { toast } from 'react-toastify'

function SigninWithProviderButton({
  provider,
  loading
}: {
  provider: string
  loading: boolean
}) {
  const handleClick = () => {
    toast.info(
      'OAuth sign-in is temporarily disabled during authentication migration'
    )
  }

  return (
    <Button
      key={provider}
      disabled
      className="w-full"
      icon={`tabler:brand-${provider}`}
      loading={loading}
      variant="secondary"
      onClick={handleClick}
    >
      {_.capitalize(provider)}
    </Button>
  )
}

export default memo(SigninWithProviderButton)
