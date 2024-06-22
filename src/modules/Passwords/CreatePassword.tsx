import { Icon } from '@iconify/react'
import React, { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@components/ButtonsAndInputs/Button'
import Input from '@components/ButtonsAndInputs/Input'
import Modal from '@components/Modals/Modal'
import { useAuthContext } from '@providers/AuthProvider'
import APIRequest from '@utils/fetchData'

function CreatePassword(): React.ReactElement {
  const { setUserData, userData } = useAuthContext()
  const [newPassword, setNewPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false)

  async function onSubmit(): Promise<void> {
    if (newPassword.trim() === '' || confirmPassword.trim() === '') {
      toast.error('Please fill in both fields')

      return
    }
    if (newPassword.trim() !== confirmPassword.trim()) {
      toast.error('Passwords do not match')

      return
    }

    setLoading(true)

    await APIRequest({
      endpoint: 'passwords/master',
      method: 'POST',
      body: { password: newPassword, id: userData.id },
      successInfo:
        'Alright! Your master password has been created. You can now start storing your passwords.',
      failureInfo:
        "Oops! Couldn't create your master password. Please try again.",
      finalCallback: () => {
        setLoading(false)
        setConfirmationModalOpen(false)
      },
      callback: data => {
        setUserData({ ...userData, masterPasswordHash: data.hash })
      }
    })
  }

  function confirmAction(): void {
    if (newPassword.trim() === '' || confirmPassword.trim() === '') {
      toast.error('Please fill in both fields')

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
      <div className="flex-center flex size-full flex-1 flex-col gap-4">
        <Icon icon="tabler:lock-plus" className="size-28" />
        <h2 className="text-4xl font-semibold">Create your master password</h2>
        <p className="mb-8 w-1/2 text-center text-lg text-bg-500">
          A master password is required to encrypt and decrypt your passwords.
        </p>
        <Input
          reference={inputRef}
          isPassword
          icon="tabler:lock"
          name="New Password"
          placeholder="Enter your preferred master password"
          value={newPassword}
          updateValue={e => {
            setNewPassword(e.target.value)
          }}
          noAutoComplete
          additionalClassName="w-1/2"
          actionButtonIcon="tabler:dice"
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

            if (inputRef.current !== null) {
              inputRef.current.focus()
            }
          }}
          darker
        />
        <Input
          isPassword
          icon="tabler:lock-check"
          name="Confirm Password"
          placeholder="Enter the password again"
          value={confirmPassword}
          updateValue={e => {
            setConfirmPassword(e.target.value)
          }}
          noAutoComplete
          additionalClassName="w-1/2"
          onKeyDown={e => {
            if (e.key === 'Enter') {
              confirmAction()
            }
          }}
          darker
        />
        <Button
          loading={loading}
          onClick={confirmAction}
          icon="tabler:check"
          className="w-1/2"
        >
          Submit
        </Button>
      </div>
      <Modal isOpen={confirmationModalOpen}>
        <h1 className="text-2xl font-semibold">
          Make sure you remember your master password!
        </h1>
        <p className="mt-2 text-bg-500">
          This master password is unchangable for now! If you accidentally
          forget the password, you lose everything. This password is hashed and
          stored in your user profile, and it is not decryptable. It will be
          used to encrypt and decrypt the passwords you store in your vault.
        </p>
        <div className="mt-6 flex w-full justify-around gap-2">
          <Button
            onClick={() => {
              setConfirmationModalOpen(false)
            }}
            variant="secondary"
            icon=""
            className="w-full"
          >
            Cancel
          </Button>
          <Button
            loading={loading}
            onClick={() => {
              onSubmit().catch(console.error)
            }}
            icon="tabler:check"
            className="w-full"
          >
            {!loading ? 'Confirm' : ''}
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default CreatePassword
