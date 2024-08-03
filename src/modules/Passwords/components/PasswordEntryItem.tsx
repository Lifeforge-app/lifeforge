/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Icon } from '@iconify/react'
import { cookieParse } from 'pocketbase'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@components/ButtonsAndInputs/Button'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import { type IPasswordEntry } from '@interfaces/password_interfaces'
import { Clipboard } from '@utils/clipboard'
import { decrypt, encrypt } from '@utils/encryption'

function PasswordEntryITem({
  password,
  masterPassword,
  setSelectedPassword,
  setIsDeletePasswordConfirmationModalOpen,
  setCreatePasswordModalOpenType,
  setExistedData,
  setPasswordList
}: {
  password: IPasswordEntry
  masterPassword: string
  setSelectedPassword: React.Dispatch<
    React.SetStateAction<IPasswordEntry | null>
  >
  setIsDeletePasswordConfirmationModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
  setCreatePasswordModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedData: React.Dispatch<React.SetStateAction<IPasswordEntry | null>>
  setPasswordList: React.Dispatch<
    React.SetStateAction<IPasswordEntry[] | 'loading' | 'error'>
  >
}): React.ReactElement {
  const [decryptedPassword, setDecryptedPassword] = useState<string | null>(
    null
  )
  const [loading, setLoading] = useState(false)
  const [copyLoading, setCopyLoading] = useState(false)

  async function getDecryptedPassword(): Promise<string> {
    const challenge = await fetch(
      `${import.meta.env.VITE_API_HOST}/passwords/password/challenge`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        }
      }
    ).then(async res => {
      const data = await res.json()
      if (res.ok && data.state === 'success') {
        return data.data
      } else {
        throw new Error(data.message)
      }
    })

    const encryptedMaster = encrypt(masterPassword, challenge)

    const decrypted = await fetch(
      `${import.meta.env.VITE_API_HOST}/passwords/password/decrypt/${
        password.id
      }`,
      {
        method: 'POST',
        body: JSON.stringify({ master: encryptedMaster }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        }
      }
    )
      .then(async res => {
        const data = await res.json()
        if (res.ok && data.state === 'success') {
          return decrypt(data.data, challenge)
        } else {
          throw new Error(data.message)
        }
      })
      .catch(err => {
        toast.error('Couldn’t fetch the password. Please try again.')
        console.error(err)
      })

    return decrypted ?? ''
  }

  function copyPassword(): void {
    setCopyLoading(true)
    if (decryptedPassword !== null) {
      Clipboard.copy(decryptedPassword)
      toast.success('Password copied!')
      setCopyLoading(false)
    } else {
      getDecryptedPassword()
        .then(password => {
          Clipboard.copy(password)
          toast.success('Password copied!')
          setCopyLoading(false)
        })
        .catch(() => {})
    }
  }

  async function pinPassword(): Promise<void> {
    await fetch(
      `${import.meta.env.VITE_API_HOST}/passwords/password/pin/${password.id}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        }
      }
    )
      .then(async res => {
        const data = await res.json()
        if (res.ok && data.state === 'success') {
          setPasswordList(prev => {
            if (prev === 'loading' || prev === 'error') return prev
            return prev
              .map(p =>
                p.id === password.id ? { ...p, pinned: !p.pinned } : p
              )
              .sort(a => (a.pinned ? -1 : 1))
          })
          toast.info(
            `Password ${password.pinned ? 'unpinned' : 'pinned'} successfully`
          )
        } else {
          throw new Error(data.message)
        }
      })
      .catch(err => {
        toast.error('Couldn’t pin the password. Please try again.')
        console.error(err)
      })
  }

  return (
    <div className="relative flex flex-col items-center gap-4 rounded-md bg-bg-50 p-4 shadow-custom dark:bg-bg-900">
      {password.pinned && (
        <Icon
          icon="tabler:pin-filled"
          className="absolute left-0 top-0 size-6 -translate-x-1/2 -translate-y-1/2 -rotate-90 text-custom-500"
        />
      )}
      <div className="flex w-full items-center gap-4">
        <div className="flex w-full min-w-0 items-center gap-4">
          <div
            className="rounded-md p-4 shadow-md"
            style={{ backgroundColor: password.color + '50' }}
          >
            <Icon
              icon={password.icon}
              className="size-6"
              style={{
                color: password.color
              }}
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <h3 className="text-xl font-semibold">{password.name}</h3>
            <p className="truncate text-bg-500">{password.username}</p>
          </div>
        </div>
        <div className="ml-8 flex shrink-0 items-center gap-2">
          <p
            className={`mr-4 select-text ${
              decryptedPassword === null
                ? 'hidden text-5xl md:flex'
                : 'hidden text-lg lg:flex '
            }`}
          >
            {decryptedPassword ?? '············'}
          </p>
          <button
            onClick={() => {
              decryptedPassword === null
                ? (() => {
                    setLoading(true)
                    getDecryptedPassword()
                      .then(setDecryptedPassword)
                      .catch(() => {})
                      .finally(() => {
                        setLoading(false)
                      })
                  })()
                : setDecryptedPassword(null)
            }}
            className="hidden rounded-lg p-2 text-bg-500 transition-all hover:bg-bg-800/70 hover:text-bg-100 md:block"
          >
            <Icon
              icon={
                loading
                  ? 'svg-spinners:180-ring'
                  : decryptedPassword === null
                  ? 'tabler:eye'
                  : 'tabler:eye-off'
              }
              className="pointer-events-none size-6"
            />
          </button>
          <button
            onClick={copyPassword}
            className="hidden rounded-lg p-2 text-bg-500 transition-all hover:bg-bg-800/70 hover:text-bg-100 sm:block"
          >
            <Icon
              icon={copyLoading ? 'svg-spinners:180-ring' : 'tabler:copy'}
              className="size-6"
            />
          </button>
          <HamburgerMenu className="relative">
            <MenuItem
              onClick={() => {
                pinPassword().catch(() => {})
              }}
              icon={password.pinned ? 'tabler:pin-filled' : 'tabler:pin'}
              text={password.pinned ? 'Unpin' : 'Pin'}
            />
            <MenuItem
              onClick={() => {
                getDecryptedPassword()
                  .then(decrypted => {
                    setCreatePasswordModalOpenType('update')
                    password.decrypted = decrypted
                    setExistedData(password)
                  })
                  .catch(() => {
                    toast.error(
                      'Couldn’t fetch the password. Please try again.'
                    )
                  })
              }}
              icon="tabler:edit"
              text="Edit"
            />
            <MenuItem
              onClick={() => {
                setSelectedPassword(password)
                setIsDeletePasswordConfirmationModalOpen(true)
              }}
              icon="tabler:trash"
              text="Delete"
              isRed
            />
          </HamburgerMenu>
        </div>
      </div>
      {decryptedPassword !== null && (
        <p className="block w-full rounded-md bg-bg-800 p-4 text-center lg:hidden">
          {decryptedPassword}
        </p>
      )}
      <Button
        onClick={copyPassword}
        loading={copyLoading}
        icon="tabler:copy"
        className="w-full sm:hidden"
        variant="secondary"
      >
        Copy
      </Button>
    </div>
  )
}

export default PasswordEntryITem
