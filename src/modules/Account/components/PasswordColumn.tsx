import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Button } from '@components/buttons'
import ConfigColumn from '@components/utilities/ConfigColumn'
import APIRequest from '@utils/fetchData'

function PasswordColumn(): React.ReactElement {
  const { t } = useTranslation('modules.accountSettings')
  const [loading, setLoading] = useState(false)

  async function onPasswordChange(): Promise<void> {
    setLoading(true)
    APIRequest({
      method: 'POST',
      endpoint: '/user/settings/request-password-reset',
      callback: () => {
        toast.info('A password reset link has been sent to your email.')
      },
      onFailure: () => {
        toast.error('Failed to send password reset link.')
      },
      finalCallback: () => {
        setLoading(false)
      }
    }).catch(console.error)
  }

  return (
    <ConfigColumn
      title={t('settings.title.password')}
      desc={t('settings.desc.password')}
      icon="tabler:key"
      hasDivider={false}
    >
      <Button
        onClick={() => {
          onPasswordChange().catch(console.error)
        }}
        loading={loading}
        variant="secondary"
        className="w-full whitespace-nowrap md:w-auto"
        icon="tabler:key"
        namespace="modules.accountSettings"
      >
        change password
      </Button>
    </ConfigColumn>
  )
}

export default PasswordColumn
