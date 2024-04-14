/* eslint-disable multiline-ternary */
import React, { useContext, useRef, useState } from 'react'
import Input from '@components/Input'
import { Icon } from '@iconify/react/dist/iconify.js'
import { toast } from 'react-toastify'
import { cookieParse } from 'pocketbase'
import { AuthContext } from '@providers/AuthProvider'
import Modal from '@components/Modal'

function CreatePassword(): React.ReactElement {
  const { setUserData, userData } = useContext(AuthContext)
  const [newPassword, setNewPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false)

  function onSubmit(): void {
    if (newPassword.trim() === '' || confirmPassword.trim() === '') {
      toast.error('Please fill in both fields')

      return
    }
    if (newPassword.trim() !== confirmPassword.trim()) {
      toast.error('Passwords do not match')

      return
    }

    setLoading(true)

    fetch(`${import.meta.env.VITE_API_HOST}/passwords/master/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookieParse(document.cookie).token}`
      },
      body: JSON.stringify({ password: newPassword, id: userData.id })
    })
      .then(async res => {
        const data = await res.json()
        if (res.ok) {
          toast.success(
            'Alright! Your master password has been created. You can now start storing your passwords.'
          )
          setUserData({ ...userData, masterPasswordHash: data.hash })
        } else {
          throw new Error(data.message)
        }
      })
      .catch(err => {
        toast.error(
          "Oops! Couldn't create your master password. Please try again."
        )
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
        setConfirmationModalOpen(false)
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
      <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-4">
        <Icon icon="tabler:lock-plus" className="h-28 w-28" />
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
          onActionButtonClick={e => {
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
        <button
          onClick={confirmAction}
          className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-custom-500 py-4 pl-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] transition-all hover:bg-custom-600 disabled:bg-bg-500 dark:text-bg-800 sm:w-1/2"
        >
          {loading ? (
            <Icon icon="svg-spinners:180-ring" className="h-6 w-6" />
          ) : (
            <>
              <Icon icon="tabler:check" className="text-xl" />
              Submit
            </>
          )}
        </button>
      </div>
      <Modal isOpen={confirmationModalOpen}>
        <h1 className="text-2xl font-semibold">
          Make sure you remember your master password!
        </h1>
        <p className="mt-2 text-bg-500">
          This master password is unchangable for now! If you accidentally
          forget the password, go to your database to reset it. This password is
          hashed and stored in your user profile, and it is not decryptable. It
          will be used to encrypt and decrypt the passwords you store in your
          vault.
        </p>
        <div className="mt-6 flex w-full justify-around gap-2">
          <button
            onClick={() => {
              setConfirmationModalOpen(false)
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-bg-800 p-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 transition-all hover:bg-bg-700"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={onSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-custom-500 p-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 transition-all hover:bg-custom-600 dark:text-bg-900"
          >
            {loading ? (
              <Icon icon="svg-spinners:180-ring" className="h-6 w-6" />
            ) : (
              <>
                <Icon icon="tabler:check" className="h-5 w-5" />
                Confirm
              </>
            )}
          </button>
        </div>
      </Modal>
    </>
  )
}

export default CreatePassword
