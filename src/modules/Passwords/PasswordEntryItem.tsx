/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Icon } from '@iconify/react'
import { cookieParse } from 'pocketbase'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import HamburgerMenu from '@components/HamburgerMenu'
import MenuItem from '@components/HamburgerMenu/MenuItem'
import { type IPasswordEntry } from '@typedec/Password'

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

  async function getDecryptedPassword(): Promise<string> {
    const decrypted = await fetch(
      `${import.meta.env.VITE_API_HOST}/passwords/password/decrypt/${
        password.id
      }?master=${masterPassword}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        }
      }
    )
      .then(async res => {
        const data = await res.json()
        if (res.ok && data.state === 'success') {
          return data.data
        } else {
          throw new Error(data.message)
        }
      })
      .catch(err => {
        toast.error('Couldn’t fetch the password. Please try again.')
        console.error(err)
      })

    return decrypted
  }

  function copyPassword(): void {
    if (decryptedPassword !== null) {
      navigator.clipboard
        .writeText(decryptedPassword)
        .then(() => {
          toast.success('Password copied!')
        })
        .catch(() => {
          toast.error('Couldn’t copy the password. Please try again.')
        })
    } else {
      getDecryptedPassword()
        .then(password => {
          navigator.clipboard
            .writeText(password)
            .then(() => {
              toast.success('Password copied!')
            })
            .catch(() => {
              toast.error('Couldn’t copy the password. Please try again.')
            })
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
              .sort((a, b) => (a.pinned ? -1 : 1))
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
    <div className="flex items-center gap-4 rounded-md bg-bg-50 p-4 shadow-custom dark:bg-bg-900">
      <div
        className="rounded-md p-4 shadow-md"
        style={{ backgroundColor: password.color + '50' }}
      >
        <Icon
          icon={password.icon}
          className="h-6 w-6"
          style={{
            color: password.color
          }}
        />
      </div>
      <div className="flex flex-1 flex-col">
        <h3 className="text-xl font-semibold">{password.name}</h3>
        <p className="text-bg-500">{password.username}</p>
      </div>
      <div className="ml-8 flex items-center gap-2 break-all">
        <p
          className={`mr-4 hidden select-text lg:flex ${
            decryptedPassword === null ? 'text-5xl' : 'text-lg'
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
          className="rounded-lg p-2 text-bg-500 transition-all hover:bg-bg-800/70 hover:text-bg-100"
        >
          <Icon
            icon={
              loading
                ? 'svg-spinners:180-ring'
                : decryptedPassword === null
                ? 'tabler:eye'
                : 'tabler:eye-off'
            }
            className="pointer-events-none h-6 w-6"
          />
        </button>
        <button
          onClick={copyPassword}
          className="rounded-lg p-2 text-bg-500 transition-all hover:bg-bg-800/70 hover:text-bg-100"
        >
          <Icon icon="tabler:copy" className="h-6 w-6" />
        </button>
        <button
          onClick={() => {
            pinPassword().catch(() => {})
          }}
          className={`rounded-lg p-2 transition-all hover:bg-bg-800/70 ${
            !password.pinned
              ? 'text-bg-500 hover:text-bg-100'
              : 'text-custom-500 hover:text-custom-400'
          }`}
        >
          <Icon
            icon={password.pinned ? 'tabler:pin-filled' : 'tabler:pin'}
            className="h-6 w-6"
          />
        </button>
        <HamburgerMenu className="relative">
          <MenuItem
            onClick={() => {
              getDecryptedPassword()
                .then(decrypted => {
                  setCreatePasswordModalOpenType('update')
                  password.decrypted = decrypted
                  setExistedData(password)
                })
                .catch(() => {
                  toast.error('Couldn’t fetch the password. Please try again.')
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
  )
}

export default PasswordEntryITem
