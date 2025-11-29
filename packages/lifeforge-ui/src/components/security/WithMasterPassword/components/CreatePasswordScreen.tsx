import { Icon } from '@iconify/react'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { encrypt } from 'shared'
import type { ForgeAPIClientController } from 'shared'

import { Button, TextInput } from '@components/controls'
import { ConfirmationModal, useModalStore } from '@components/modals'

function CreatePasswordScreen({
  controller,
  challengeController
}: {
  controller: ForgeAPIClientController
  challengeController: ForgeAPIClientController
}) {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('common.vault')

  const [newPassword, setNewPassword] = useState<string>('')

  const [confirmPassword, setConfirmPassword] = useState<string>('')

  const createPasswordMutation = useMutation(
    controller.mutationOptions({
      onSuccess: () => {
        window.location.reload()
      },
      onError: () => {
        toast.error('Failed to create password')
      }
    })
  )

  function confirmAction(): void {
    if (newPassword.trim() === '' || confirmPassword.trim() === '') {
      toast.error(t('input.error.fieldEmpty'))

      return
    }

    if (newPassword.trim() !== confirmPassword.trim()) {
      toast.error('Passwords do not match')

      return
    }

    open(ConfirmationModal, {
      title: t('vault.confirmSetNewPassword.title'),
      description: t('vault.confirmSetNewPassword.desc'),
      onConfirm: async () => {
        const challenge = (await challengeController.query()) as string

        await createPasswordMutation.mutateAsync({
          password: encrypt(newPassword, challenge)
        } as never)
      }
    })
  }

  function generateRandomPassword(): void {
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    const lowerCase = 'abcdefghijklmnopqrstuvwxyz'

    const special = '!@#$%^&*()_+'

    const numbers = '0123456789'

    const all = upperCase + lowerCase + numbers + special

    let password = ''

    for (let i = 0; i < 12; i++) {
      password += all[Math.floor(Math.random() * all.length)]
    }
    setNewPassword(password)
    setConfirmPassword(password)

    toast.success('Random password generated successfully')
  }

  return (
    <>
      <div className="flex-center size-full flex-1 flex-col gap-3">
        <Icon className="size-28" icon="tabler:lock-plus" />
        <h2 className="text-4xl font-semibold">
          {t('vault.createPassword.title')}
        </h2>
        <p className="text-bg-500 mb-8 w-1/2 text-center text-lg">
          {t('vault.createPassword.desc')}
        </p>
        <TextInput
          key="newPassword"
          isPassword
          actionButtonProps={{
            icon: 'tabler:dice',
            onClick: generateRandomPassword
          }}
          className="w-1/2"
          icon="tabler:lock"
          label="vault.inputs.newPassword"
          namespace="common.vault"
          placeholder="••••••••••••••••"
          value={newPassword}
          onChange={setNewPassword}
        />
        <TextInput
          key="confirmPassword"
          isPassword
          className="w-1/2"
          icon="tabler:lock-check"
          label="vault.inputs.confirmPassword"
          namespace="common.vault"
          placeholder="••••••••••••••••"
          value={confirmPassword}
          onChange={setConfirmPassword}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              confirmAction()
            }
          }}
        />
        <Button className="w-1/2" icon="tabler:check" onClick={confirmAction}>
          Submit
        </Button>
      </div>
    </>
  )
}

export default CreatePasswordScreen
