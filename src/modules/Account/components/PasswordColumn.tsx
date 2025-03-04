import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Button } from '@components/buttons'
import ConfigColumn from '@components/utilities/ConfigColumn'
import APIRequestV2 from '@utils/newFetchData'

function PasswordColumn(): React.ReactElement {
  const { t } = useTranslation('modules.accountSettings')
  const [loading, setLoading] = useState(false)

  async function onPasswordChange(): Promise<void> {
    setLoading(true)

    try {
      await APIRequestV2('/user/settings/request-password-reset', {
        method: 'POST'
      })
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
      hasDivider={false}
      icon="tabler:key"
      title={t('settings.title.password')}
    >
      <Button
        className="w-full whitespace-nowrap md:w-auto"
        icon="tabler:key"
        loading={loading}
        namespace="modules.accountSettings"
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
