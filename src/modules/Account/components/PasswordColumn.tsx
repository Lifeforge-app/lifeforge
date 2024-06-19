import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import Button from '@components/ButtonsAndInputs/Button'
import APIRequest from '@utils/fetchData'

function PasswordColumn(): React.ReactElement {
  const { t } = useTranslation()
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
    <div className="relative z-20 mb-8 flex w-full flex-col items-center justify-between gap-6 px-4 md:flex-row">
      <div className="w-full md:w-auto">
        <h3 className="block text-xl font-medium leading-normal">
          {t('accountSettings.title.password')}
        </h3>
        <p className="text-bg-500">{t('accountSettings.desc.password')}</p>
      </div>
      <Button
        onClick={() => {
          onPasswordChange().catch(console.error)
        }}
        disabled={loading}
        type="secondary"
        className="w-full whitespace-nowrap md:w-auto"
        icon={loading ? 'svg-spinners:180-ring' : 'tabler:key'}
      >
        change password
      </Button>
    </div>
  )
}

export default PasswordColumn
