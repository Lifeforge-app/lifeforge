import forgeAPI from '@/utils/forgeAPI'
import { Button, OptionsColumn } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { usePromiseLoading } from 'shared'

function PasswordColumn() {
  const { t } = useTranslation('apps.accountSettings')

  async function handlePasswordChange() {
    try {
      await forgeAPI.user.settings.requestPasswordReset.mutate({})

      toast.info('A password reset link has been sent to your email.')
    } catch {
      toast.error('Failed to send password reset link.')
    }
  }

  const [loading, onSubmit] = usePromiseLoading(handlePasswordChange)

  return (
    <OptionsColumn
      description={t('settings.desc.password')}
      icon="tabler:key"
      title={t('settings.title.password')}
    >
      <Button
        className="w-full whitespace-nowrap md:w-auto"
        icon="tabler:key"
        loading={loading}
        namespace="apps.accountSettings"
        variant="secondary"
        onClick={onSubmit}
      >
        change password
      </Button>
    </OptionsColumn>
  )
}

export default PasswordColumn
