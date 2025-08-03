import { Icon } from '@iconify/react'
import { Button, TextInput } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import CreatePasswordConfirmationModal from './modals/CreatePasswordConfirmationModal'

function CreatePasswordScreen({ endpoint }: { endpoint: string }) {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('common.vault')

  const [newPassword, setNewPassword] = useState<string>('')

  const [confirmPassword, setConfirmPassword] = useState<string>('')

  function confirmAction(): void {
    if (newPassword.trim() === '' || confirmPassword.trim() === '') {
      toast.error(t('input.error.fieldEmpty'))

      return
    }

    if (newPassword.trim() !== confirmPassword.trim()) {
      toast.error('Passwords do not match')

      return
    }

    open(CreatePasswordConfirmationModal, {
      newPassword,
      confirmPassword,
      endpoint
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
          label="New Password"
          namespace="common.vault"
          placeholder="••••••••••••••••"
          setValue={setNewPassword}
          tKey="vault"
          value={newPassword}
        />
        <TextInput
          key="confirmPassword"
          isPassword
          className="w-1/2"
          icon="tabler:lock-check"
          label="Confirm Password"
          namespace="common.vault"
          placeholder="••••••••••••••••"
          setValue={setConfirmPassword}
          tKey="vault"
          value={confirmPassword}
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
