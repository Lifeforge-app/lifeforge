import { Icon } from '@iconify/react'
import { Button, TextInput } from 'lifeforge-ui'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { fetchAPI } from 'shared/lib'

import { encrypt } from '../utils/encryption'

function LockedScreen({
  endpoint,
  setMasterPassword
}: {
  endpoint: string
  setMasterPassword: React.Dispatch<React.SetStateAction<string>>
}) {
  const [masterPassWordInputContent, setMasterPassWordInputContent] =
    useState<string>('')
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation('common.vault')

  async function onSubmit(): Promise<void> {
    if (masterPassWordInputContent.trim() === '') {
      toast.error('Please fill in all the field')
      return
    }

    setLoading(true)

    try {
      const challenge = await fetchAPI<string>(
        import.meta.env.VITE_API_URL,
        `${endpoint}/challenge`
      )

      const data = await fetchAPI<boolean>(
        import.meta.env.VITE_API_URL,
        `${endpoint}/verify`,
        {
          method: 'POST',
          body: {
            password: encrypt(masterPassWordInputContent, challenge)
          }
        }
      )

      if (data === true) {
        toast.info(
          t('fetch.success', {
            action: t('fetch.unlock')
          })
        )
        setMasterPassword(masterPassWordInputContent)
        setMasterPassWordInputContent('')
      } else {
        toast.error(
          t('fetch.failure', {
            action: t('fetch.unlock')
          })
        )
      }
    } catch {
      toast.error(
        t('fetch.failure', {
          action: t('fetch.unlock')
        })
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-center size-full flex-1 flex-col gap-3">
      <Icon className="size-28" icon="tabler:lock-access" />
      <h2 className="text-4xl font-semibold">{t(`vault.lockedMessage`)}</h2>
      <p className="text-bg-500 mb-8 text-center text-lg">
        {t(`vault.passwordRequired`)}
      </p>
      <TextInput
        darker
        isPassword
        noAutoComplete
        className="w-full md:w-3/4 xl:w-1/2"
        icon="tabler:lock"
        name="Master Password"
        namespace="common.vault"
        placeholder={'••••••••••••••••'}
        setValue={setMasterPassWordInputContent}
        tKey="vault"
        value={masterPassWordInputContent}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            onSubmit().catch(console.error)
          }
        }}
      />
      <Button
        className="w-full md:w-3/4 xl:w-1/2"
        icon="tabler:lock"
        loading={loading}
        namespace="common.vault"
        tKey="vault"
        onClick={() => {
          onSubmit().catch(console.error)
        }}
      >
        Unlock
      </Button>
    </div>
  )
}

export default LockedScreen
