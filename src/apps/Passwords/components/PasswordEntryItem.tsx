import { Icon } from '@iconify/react'
import clsx from 'clsx'
import copy from 'copy-to-clipboard'
import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

import { Button, HamburgerMenu, MenuItem } from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

import { usePasswordContext } from '@apps/Passwords/providers/PasswordsProvider'

import useComponentBg from '@hooks/useComponentBg'

import { type IPasswordEntry } from '../interfaces/password_interfaces'
import { getDecryptedPassword } from '../utils/getDecryptedPassword'

function PasswordEntryITem({
  password,
  pinPassword
}: {
  password: IPasswordEntry
  pinPassword: (id: string) => Promise<void>
}) {
  const open = useModalStore(state => state.open)

  const { masterPassword } = usePasswordContext()
  const { componentBg } = useComponentBg()
  const [decryptedPassword, setDecryptedPassword] = useState<string | null>(
    null
  )
  const [loading, setLoading] = useState(false)
  const [copyLoading, setCopyLoading] = useState(false)

  async function copyPassword() {
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

  async function onEdit() {
    try {
      const decrypted = await getDecryptedPassword(masterPassword, password.id)
      open('passwords.modifyPassword', {
        type: 'update',
        existedData: {
          ...password,
          decrypted
        }
      })
    } catch {
      toast.error('Couldn’t fetch the password. Please try again.')
    }
  }

  const handleDeletePassword = useCallback(() => {
    open('deleteConfirmation', {
      apiEndpoint: 'passwords/entries',
      confirmationText: 'Delete this password',
      customText: `Are you sure you want to delete the password for ${password.name}? This action is irreversible.`,
      data: password,
      itemName: 'password',
      queryKey: ['passwords', 'entries']
    })
  }, [password])

  return (
    <div
      className={clsx(
        'shadow-custom relative flex flex-col items-center gap-4 rounded-md p-4',
        componentBg
      )}
    >
      {password.pinned && (
        <Icon
          className="text-custom-500 absolute top-0 left-0 size-6 -translate-x-1/2 -translate-y-1/2 -rotate-90"
          icon="tabler:pin-filled"
        />
      )}
      <div className="flex w-full items-center gap-4">
        <div className="flex w-full min-w-0 items-center gap-4">
          <div
            className="rounded-md p-4 shadow-md"
            style={{ backgroundColor: password.color + '50' }}
          >
            <Icon
              className="size-6"
              icon={password.icon}
              style={{
                color: password.color
              }}
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <h3 className="text-xl font-semibold">{password.name}</h3>
            <p className="text-bg-500 truncate">{password.username}</p>
          </div>
        </div>
        <div className="ml-8 flex shrink-0 items-center gap-2">
          <p
            className={clsx(
              'mr-4 select-text',
              decryptedPassword === null
                ? 'hidden text-5xl tracking-tighter md:flex'
                : 'hidden text-lg lg:flex'
            )}
            style={decryptedPassword === null ? { fontFamily: 'Arial' } : {}}
          >
            {decryptedPassword ?? (
              <span className="flex items-center gap-1.5">
                {Array.from({ length: 12 }, (_, i) => (
                  <span
                    key={i}
                    className="bg-bg-500 dark:bg-bg-100 size-1.5 rounded-full"
                  ></span>
                ))}
              </span>
            )}
          </p>
          <Button
            className="hidden p-2! sm:flex"
            icon={(() => {
              if (loading) {
                return 'svg-spinners:180-ring'
              }

              return decryptedPassword === null
                ? 'tabler:eye'
                : 'tabler:eye-off'
            })()}
            iconClassName="size-6"
            loading={loading}
            variant="plain"
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
          />
          <Button
            className="hidden p-2! sm:flex"
            icon="tabler:copy"
            loading={copyLoading}
            variant="plain"
            onClick={copyPassword}
          />
          <HamburgerMenu>
            <MenuItem
              icon={password.pinned ? 'tabler:pin-filled' : 'tabler:pin'}
              text={password.pinned ? 'Unpin' : 'Pin'}
              onClick={() => {
                pinPassword(password.id)
              }}
            />
            <MenuItem icon="tabler:pencil" text="Edit" onClick={onEdit} />
            <MenuItem
              isRed
              icon="tabler:trash"
              text="Delete"
              onClick={handleDeletePassword}
            />
          </HamburgerMenu>
        </div>
      </div>
      {decryptedPassword !== null && (
        <p className="bg-bg-800 block w-full rounded-md p-4 text-center lg:hidden">
          {decryptedPassword}
        </p>
      )}
      <Button
        className="w-full sm:hidden"
        icon="tabler:copy"
        loading={copyLoading}
        variant="secondary"
        onClick={copyPassword}
      >
        Copy
      </Button>
    </div>
  )
}

export default PasswordEntryITem
