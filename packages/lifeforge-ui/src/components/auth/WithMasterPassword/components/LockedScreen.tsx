import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { ForgeAPIClientController, usePromiseLoading } from 'shared'
import { encrypt } from 'shared'

import { Button, TextInput } from '@components/inputs'

function LockedScreen({
  challengeController,
  verifyController,
  setMasterPassword
}: {
  challengeController: ForgeAPIClientController
  verifyController: ForgeAPIClientController
  setMasterPassword: React.Dispatch<React.SetStateAction<string>>
}) {
  const [masterPassWordInputContent, setMasterPassWordInputContent] =
    useState<string>('')

  const { t } = useTranslation('common.vault')

  async function handleSubmit(): Promise<void> {
    if (masterPassWordInputContent.trim() === '') {
      toast.error('Please fill in all the field')

      return
    }

    try {
      const challenge = (await challengeController.query()) as string

      const data = await verifyController.mutate({
        password: encrypt(masterPassWordInputContent, challenge)
      } as never)

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
    }
  }

  const [loading, onSubmit] = usePromiseLoading(handleSubmit)

  return (
    <div className="flex-center size-full flex-1 flex-col gap-3">
      <Icon className="size-28" icon="tabler:lock-access" />
      <h2 className="text-4xl font-semibold">{t(`vault.lockedMessage`)}</h2>
      <p className="text-bg-500 mb-8 text-center text-lg">
        {t(`vault.passwordRequired`)}
      </p>
      <TextInput
        isPassword
        className="w-full flex-0! md:w-3/4 xl:w-1/2"
        icon="tabler:lock"
        label="vault.inputs.masterPassword"
        namespace="common.vault"
        placeholder={'••••••••••••••••'}
        value={masterPassWordInputContent}
        onChange={setMasterPassWordInputContent}
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
        onClick={() => {
          onSubmit().catch(console.error)
        }}
      >
        vault.buttons.unlock
      </Button>
    </div>
  )
}

export default LockedScreen
