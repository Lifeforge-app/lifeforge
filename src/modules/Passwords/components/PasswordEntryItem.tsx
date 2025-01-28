import { Icon } from '@iconify/react'
import copy from 'copy-to-clipboard'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Button } from '@components/buttons'
import HamburgerMenu from '@components/buttons/HamburgerMenu'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import useThemeColors from '@hooks/useThemeColor'
import { type IPasswordEntry } from '@interfaces/password_interfaces'
import { usePasswordContext } from '@providers/PasswordsProvider'
import { getDecryptedPassword } from '../utils/getDecryptedPassword'

function PasswordEntryITem({
  password,
  pinPassword
}: {
  password: IPasswordEntry
  pinPassword: (id: string) => Promise<void>
}): React.ReactElement {
  const {
    masterPassword,
    setIsDeletePasswordConfirmationModalOpen,
    setExistedData,
    setModifyPasswordModalOpenType
  } = usePasswordContext()
  const { componentBg } = useThemeColors()
  const [decryptedPassword, setDecryptedPassword] = useState<string | null>(
    null
  )
  const [loading, setLoading] = useState(false)
  const [copyLoading, setCopyLoading] = useState(false)

  async function copyPassword(): Promise<void> {
    setCopyLoading(true)
    if (decryptedPassword !== null) {
      copy(decryptedPassword)
      toast.success('Password copied!')
      setCopyLoading(false)
    } else {
      const decrypted = await getDecryptedPassword(masterPassword, password.id)
      copy(decrypted)
      toast.success('Password copied!')
      setCopyLoading(false)
    }
  }

  return (
    <div
      className={`relative flex flex-col items-center gap-4 rounded-md p-4 shadow-custom ${componentBg}`}
    >
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
                ? 'hidden text-5xl tracking-tighter md:flex'
                : 'hidden text-lg lg:flex '
            }`}
            style={decryptedPassword === null ? { fontFamily: 'Arial' } : {}}
          >
            {decryptedPassword ?? (
              <span className="flex items-center gap-1.5">
                {Array.from({ length: 12 }, (_, i) => (
                  <span
                    key={i}
                    className="size-1.5 rounded-full bg-bg-500 dark:bg-bg-100"
                  ></span>
                ))}
              </span>
            )}
          </p>
          <Button
            variant="no-bg"
            className="hidden p-2! sm:flex"
            iconClassName="size-6"
            onClick={() => {
              if (decryptedPassword === null) {
                ;(() => {
                  setLoading(true)
                  getDecryptedPassword(masterPassword, password.id)
                    .then(setDecryptedPassword)
                    .catch(() => {})
                    .finally(() => {
                      setLoading(false)
                    })
                })()
              } else {
                setDecryptedPassword(null)
              }
            }}
            loading={loading}
            icon={(() => {
              if (loading) {
                return 'svg-spinners:180-ring'
              }

              return decryptedPassword === null
                ? 'tabler:eye'
                : 'tabler:eye-off'
            })()}
          />
          <Button
            onClick={copyPassword}
            loading={copyLoading}
            icon="tabler:copy"
            className="hidden p-2! sm:flex"
            variant="no-bg"
          />
          <HamburgerMenu className="relative">
            <MenuItem
              onClick={() => {
                pinPassword(password.id)
              }}
              icon={password.pinned ? 'tabler:pin-filled' : 'tabler:pin'}
              text={password.pinned ? 'Unpin' : 'Pin'}
            />
            <MenuItem
              onClick={() => {
                getDecryptedPassword(masterPassword, password.id)
                  .then(decrypted => {
                    password.decrypted = decrypted
                    setExistedData(password)
                    setModifyPasswordModalOpenType('update')
                  })
                  .catch(() => {
                    toast.error(
                      'Couldn’t fetch the password. Please try again.'
                    )
                  })
              }}
              icon="tabler:pencil"
              text="Edit"
            />
            <MenuItem
              onClick={() => {
                setIsDeletePasswordConfirmationModalOpen(true)
                setExistedData(password)
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
