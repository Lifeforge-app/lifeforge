/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState } from 'react'
import { type IPasswordEntry } from '.'
import { Icon } from '@iconify/react/dist/iconify.js'
import { cookieParse } from 'pocketbase'
import { toast } from 'react-toastify'
import HamburgerMenu from '../../components/general/HamburgerMenu'
import MenuItem from '../../components/general/HamburgerMenu/MenuItem'

function PasswordEntryITem({
  password,
  masterPassword
}: {
  password: IPasswordEntry
  masterPassword: string
}): React.ReactElement {
  const [decryptedPassword, setDecryptedPassword] = useState<string | null>(
    null
  )
  const [loading, setLoading] = useState(false)

  async function getDecryptedPassword(id: string): Promise<string> {
    const decrypted = await fetch(
      `${
        import.meta.env.VITE_API_HOST
      }/passwords/password/decrypt/${id}?master=${masterPassword}`,
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

  return (
    <div className="flex items-center gap-4 rounded-md bg-bg-900 p-4">
      <div
        className="rounded-md p-4"
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
                  getDecryptedPassword(password.id)
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
          onClick={() => {
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
              getDecryptedPassword(password.id)
                .then(password => {
                  navigator.clipboard
                    .writeText(password)
                    .then(() => {
                      toast.success('Password copied!')
                    })
                    .catch(() => {
                      toast.error(
                        'Couldn’t copy the password. Please try again.'
                      )
                    })
                })
                .catch(() => {})
            }
          }}
          className="rounded-lg p-2 text-bg-500 transition-all hover:bg-bg-800/70 hover:text-bg-100"
        >
          <Icon icon="tabler:copy" className="h-6 w-6" />
        </button>
        <HamburgerMenu position="relative">
          <MenuItem icon="tabler:edit" text="Edit" />
          <MenuItem icon="tabler:trash" text="Delete" isRed />
        </HamburgerMenu>
      </div>
    </div>
  )
}

export default PasswordEntryITem
