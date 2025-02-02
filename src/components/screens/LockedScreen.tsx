import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Button } from '@components/buttons'
import { TextInput } from '@components/inputs'
import { useAuthContext } from '@providers/AuthProvider'
import { encrypt } from '@utils/encryption'
import APIRequest from '@utils/fetchData'

function LockedScreen({
  endpoint,
  setMasterPassword,
  fetchChallenge
}: {
  endpoint: string
  setMasterPassword: React.Dispatch<React.SetStateAction<string>>
  fetchChallenge: (
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>
  ) => Promise<string>
}): React.ReactElement {
  const { userData } = useAuthContext()
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

    const challenge = await fetchChallenge(setLoading)

    await APIRequest({
      endpoint,
      method: 'POST',
      body: {
        password: encrypt(masterPassWordInputContent, challenge),
        id: userData.id
      },
      callback: data => {
        if (data.data === true) {
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
      },
      finalCallback: () => {
        setLoading(false)
      },
      onFailure: () => {
        toast.error(
          t('fetch.failure', {
            action: t('fetch.unlock')
          })
        )
      }
    })
  }

  return (
    <div className="flex-center size-full flex-1 flex-col gap-4">
      <Icon className="size-28" icon="tabler:lock-access" />
      <h2 className="text-4xl font-semibold">{t(`vault.lockedMessage`)}</h2>
      <p className="mb-8 text-center text-lg text-bg-500">
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
        tKey="vault"
        updateValue={setMasterPassWordInputContent}
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
