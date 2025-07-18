import { Button, ConfigColumn } from 'lifeforge-ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { fetchAPI } from 'shared/lib'

function PasswordColumn() {
  const { t } = useTranslation('core.accountSettings')
  const [loading, setLoading] = useState(false)

  async function onPasswordChange() {
    setLoading(true)

    try {
      await fetchAPI(
        import.meta.env.VITE_API_URL,
        '/user/settings/request-password-reset',
        {
          method: 'POST'
        }
      )
      toast.info('A password reset link has been sent to your email.')
    } catch {
      toast.error('Failed to send password reset link.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ConfigColumn
      desc={t('settings.desc.password')}
      icon="tabler:key"
      title={t('settings.title.password')}
    >
      <Button
        className="w-full whitespace-nowrap md:w-auto"
        icon="tabler:key"
        loading={loading}
        namespace="core.accountSettings"
        variant="secondary"
        onClick={() => {
          onPasswordChange().catch(console.error)
        }}
      >
        change password
      </Button>
    </ConfigColumn>
  )
}

export default PasswordColumn
