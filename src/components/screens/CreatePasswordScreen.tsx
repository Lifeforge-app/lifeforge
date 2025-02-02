/* eslint-disable sonarjs/pseudo-random */
import { Icon } from '@iconify/react'

import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Button } from '@components/buttons'
import { TextInput } from '@components/inputs'
import ModalWrapper from '@components/modals/ModalWrapper'
import { useAuthContext } from '@providers/AuthProvider'
import APIRequest from '@utils/fetchData'

function CreatePasswordScreen({
  endpoint,
  keyInUserData
}: {
  endpoint: string
  keyInUserData: string
}): React.ReactElement {
  const { t } = useTranslation('common.vault')
  const { setUserData, userData } = useAuthContext()
  const [newPassword, setNewPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const inputRef2 = useRef<HTMLInputElement>(null)
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false)

  async function onSubmit(): Promise<void> {
    if (newPassword.trim() === '' || confirmPassword.trim() === '') {
      toast.error(t('input.error.fieldEmpty'))

      return
    }
    if (newPassword.trim() !== confirmPassword.trim()) {
      toast.error('Passwords do not match')

      return
    }

    setLoading(true)

    await APIRequest({
      endpoint,
      method: 'POST',
      body: { password: newPassword, id: userData.id },
      successInfo: 'created',
      failureInfo: 'created',
      finalCallback: () => {
        setLoading(false)
        setConfirmationModalOpen(false)
      },
      callback: () => {
        setUserData({ ...userData, [keyInUserData]: true })
      }
    })
  }

  function confirmAction(): void {
    if (newPassword.trim() === '' || confirmPassword.trim() === '') {
      toast.error(t('input.error.fieldEmpty'))

      return
    }
    if (newPassword.trim() !== confirmPassword.trim()) {
      toast.error('Passwords do not match')

      return
    }

    setConfirmationModalOpen(true)
  }

  return (
    <>
      <div className="flex-center size-full flex-1 flex-col gap-4">
        <Icon className="size-28" icon="tabler:lock-plus" />
        <h2 className="text-4xl font-semibold">
          {t('vault.createPassword.title')}
        </h2>
        <p className="mb-8 w-1/2 text-center text-lg text-bg-500">
          {t('vault.createPassword.desc')}
        </p>
        <TextInput
          key="newPassword"
          ref={inputRef}
          darker
          isPassword
          noAutoComplete
          actionButtonIcon="tabler:dice"
          className="w-1/2"
          icon="tabler:lock"
          name="New Password"
          namespace="common.vault"
          placeholder="••••••••••••••••"
          tKey="vault"
          updateValue={setNewPassword}
          value={newPassword}
          onActionButtonClick={() => {
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
          }}
        />
        <TextInput
          key="confirmPassword"
          ref={inputRef2}
          darker
          isPassword
          noAutoComplete
          className="w-1/2"
          icon="tabler:lock-check"
          name="Confirm Password"
          namespace="common.vault"
          placeholder="••••••••••••••••"
          tKey="vault"
          updateValue={setConfirmPassword}
          value={confirmPassword}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              confirmAction()
            }
          }}
        />
        <Button
          className="w-1/2"
          icon="tabler:check"
          loading={loading}
          onClick={confirmAction}
        >
          Submit
        </Button>
      </div>
      <ModalWrapper isOpen={confirmationModalOpen}>
        <h1 className="text-2xl font-semibold">
          Make sure you remember your master password!
        </h1>
        <p className="mt-2 text-bg-500">
          This master password is unchangable for now! If you accidentally
          forget the password, you lose everything. This password is hashed and
          stored in your user profile, and it is not decryptable. It will be
          used to encrypt and decrypt the data you store in your vault.
        </p>
        <div className="mt-6 flex w-full justify-around gap-2">
          <Button
            className="w-full"
            icon=""
            variant="secondary"
            onClick={() => {
              setConfirmationModalOpen(false)
            }}
          >
            Cancel
          </Button>
          <Button
            className="w-full"
            icon="tabler:check"
            loading={loading}
            onClick={() => {
              onSubmit().catch(console.error)
            }}
          >
            {!loading ? 'Confirm' : ''}
          </Button>
        </div>
      </ModalWrapper>
    </>
  )
}

export default CreatePasswordScreen
