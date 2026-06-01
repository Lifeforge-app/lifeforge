import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { usePromiseLoading } from '@lifeforge/shared'
import { Button, OptionsColumn } from '@lifeforge/ui'

import forgeAPI from '@/forgeAPI'

function PasswordColumn() {
  const { t } = useTranslation('common.accountSettings')

  async function handlePasswordChange() {
    try {
      await forgeAPI.user.settings.requestPasswordReset.mutate(undefined)

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
        icon="tabler:key"
        loading={loading}
        namespace="common.accountSettings"
        variant="secondary"
        width={{ base: '100%', md: 'auto' }}
        onClick={onSubmit}
      >
        change password
      </Button>
    </OptionsColumn>
  )
}

export default PasswordColumn
