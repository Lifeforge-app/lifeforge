import { Icon } from '@iconify/react'
import clsx from 'clsx'
import copy from 'copy-to-clipboard'
import dayjs from 'dayjs'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import {
  Button,
  DeleteConfirmationModal,
  HamburgerMenu,
  MenuItem
} from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

import { usePasswordContext } from '@apps/Passwords/providers/PasswordsProvider'

import useComponentBg from '@hooks/useComponentBg'

import { type IPasswordEntry } from '../interfaces/password_interfaces'
import ModifyPasswordModal from '../modals/ModifyPasswordModal'
import { getDecryptedPassword } from '../utils/getDecryptedPassword'

function PasswordEntryITem({
  password,
  pinPassword
}: {
  password: IPasswordEntry
  pinPassword: (id: string) => Promise<void>
}) {
  const { t } = useTranslation('apps.passwords')
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

  async function handleEdit() {
    try {
      const decrypted = await getDecryptedPassword(masterPassword, password.id)
      open(ModifyPasswordModal, {
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

  const decryptPassword = useCallback(async () => {
    if (decryptedPassword !== null) {
      setDecryptedPassword(null)
      return
    }

    setLoading(true)

    try {
      const decrypted = await getDecryptedPassword(masterPassword, password.id)
      setDecryptedPassword(decrypted)
    } catch {
      toast.error('Couldn’t decrypt the password. Please try again.')
      setDecryptedPassword(null)
    } finally {
      setLoading(false)
    }
  }, [masterPassword, password.id, decryptedPassword])

  const handleDeletePassword = useCallback(() => {
    open(DeleteConfirmationModal, {
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
        'shadow-custom relative flex flex-col items-center gap-3 rounded-md p-4',
        componentBg
      )}
    >
      {password.pinned && (
        <Icon
          className="text-custom-500 absolute top-0 left-0 size-6 -translate-x-1/2 -translate-y-1/2 -rotate-90"
          icon="tabler:pin-filled"
        />
      )}
      <div className="flex w-full items-center gap-3">
        <div className="flex w-full min-w-0 items-center gap-3">
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
            <h3 className="truncate text-xl font-semibold">{password.name}</h3>
            <p className="text-bg-500 truncate">{password.username}</p>
          </div>
        </div>
        <div className="ml-8 flex shrink-0 items-center gap-2 pt-2">
          <div className="mr-4 flex flex-col items-end gap-2">
            <code
              className={clsx(
                'select-text',
                decryptedPassword === null
                  ? 'hidden text-5xl tracking-tighter md:block'
                  : 'hidden max-w-96 min-w-0 truncate text-lg lg:block'
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
            </code>
            <p
              className={clsx(
                'hidden text-sm md:block',
                dayjs(password.updated).isBefore(dayjs().subtract(3, 'months'))
                  ? 'text-red-500'
                  : 'text-bg-500'
              )}
            >
              {t('lastUpdated')}: {dayjs(password.updated).fromNow()}
            </p>
          </div>
          <Button
            className="hidden p-2! sm:flex"
            icon={decryptedPassword === null ? 'tabler:eye' : 'tabler:eye-off'}
            iconClassName="size-6"
            loading={loading}
            variant="plain"
            onClick={decryptPassword}
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
              className="flex sm:hidden"
              icon={
                decryptedPassword === null ? 'tabler:eye' : 'tabler:eye-off'
              }
              loading={loading}
              text={
                decryptedPassword === null ? 'Show Password' : 'Hide Password'
              }
              onClick={decryptPassword}
            />
            <MenuItem
              icon={password.pinned ? 'tabler:pin-filled' : 'tabler:pin'}
              text={password.pinned ? 'Unpin' : 'Pin'}
              onClick={() => {
                pinPassword(password.id)
              }}
            />
            <MenuItem icon="tabler:pencil" text="Edit" onClick={handleEdit} />
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
        <code className="bg-bg-800 block w-full rounded-md p-4 break-all lg:hidden">
          {decryptedPassword}
        </code>
      )}
    </div>
  )
}

export default PasswordEntryITem
