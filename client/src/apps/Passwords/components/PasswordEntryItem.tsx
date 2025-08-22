import { Icon } from '@iconify/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { encrypt } from '@utils/encryption'
import forgeAPI from '@utils/forgeAPI'
import clsx from 'clsx'
import copy from 'copy-to-clipboard'
import dayjs from 'dayjs'
import {
  Button,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { usePromiseLoading } from 'shared'

import type { PasswordEntry } from '..'
import ModifyPasswordModal from '../modals/ModifyPasswordModal'
import { getDecryptedPassword } from '../utils/getDecryptedPassword'

function PasswordEntryItem({
  password,
  pinPassword,
  masterPassword
}: {
  password: PasswordEntry
  pinPassword: (id: string) => Promise<void>
  masterPassword: string
}) {
  const queryClient = useQueryClient()

  const { t } = useTranslation('apps.passwords')

  const open = useModalStore(state => state.open)

  const [decryptedPassword, setDecryptedPassword] = useState<string | null>(
    null
  )

  const [copyLoading, setCopyLoading] = useState(false)

  const [rotateLoading, setRotateLoading] = useState(false)

  const deleteMutation = useMutation(
    forgeAPI.passwords.entries.remove
      .input({
        id: password.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['passwords', 'entries'] })
        },
        onError: () => {
          toast.error('Failed to delete password. Please try again.')
        }
      })
  )

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
        initialData: {
          ...password,
          decrypted
        },
        masterPassword
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

    try {
      const decrypted = await getDecryptedPassword(masterPassword, password.id)

      setDecryptedPassword(decrypted)
    } catch {
      toast.error('Couldn’t decrypt the password. Please try again.')
      setDecryptedPassword(null)
    }
  }, [masterPassword, password.id, decryptedPassword])

  const [loading, onDecrypt] = usePromiseLoading(decryptPassword)

  const handleDeletePassword = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete Password',
      description: `Are you sure you want to delete the password for ${password.name}? This action cannot be undone.`,
      buttonType: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync({})
      }
    })
  }, [password])

  return (
    <div className="shadow-custom component-bg relative flex flex-col items-center gap-3 rounded-md p-4">
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
            onClick={onDecrypt}
          />
          <Button
            className="hidden p-2! sm:flex"
            icon="tabler:copy"
            loading={copyLoading}
            variant="plain"
            onClick={copyPassword}
          />
          <ContextMenu>
            <ContextMenuItem
              icon="tabler:rotate"
              label="Rotate Password"
              loading={rotateLoading}
              onClick={async () => {
                setRotateLoading(true)

                const alphabets = 'abcdefghijklmnopqrstuvwxyz'

                const ALPHABETS = alphabets.toUpperCase()

                const numbers = '0123456789'

                const symbols = '!@#$%^&*()_+[]{}|;:,.<>?'

                const allCharacters = `${alphabets}${ALPHABETS}${numbers}${symbols}`

                const passwordLength = 16

                let generatedPassword = ''

                for (let i = 0; i < passwordLength; i++) {
                  const randomIndex = Math.floor(
                    Math.random() * allCharacters.length
                  )

                  generatedPassword += allCharacters[randomIndex]
                }

                const challenge =
                  await forgeAPI.passwords.entries.getChallenge.query()

                const encryptedMaster = encrypt(masterPassword, challenge)

                const encryptedPassword = encrypt(generatedPassword, challenge)

                await forgeAPI.passwords.entries.update
                  .input({
                    id: password.id
                  })
                  .mutate({
                    ...password,
                    password: encryptedPassword,
                    master: encryptedMaster
                  })

                copy(generatedPassword)
                toast.success('Password copied to clipboard')

                setRotateLoading(false)

                queryClient.invalidateQueries({
                  queryKey: ['passwords', 'entries']
                })

                setDecryptedPassword(generatedPassword)
              }}
            />
            <ContextMenuItem
              className="flex sm:hidden"
              icon={
                decryptedPassword === null ? 'tabler:eye' : 'tabler:eye-off'
              }
              label={
                decryptedPassword === null ? 'Show Password' : 'Hide Password'
              }
              loading={loading}
              onClick={onDecrypt}
            />
            <ContextMenuItem
              className="flex sm:hidden"
              icon="tabler:copy"
              label="Copy Password"
              loading={copyLoading}
              onClick={copyPassword}
            />
            <ContextMenuItem
              icon={password.pinned ? 'tabler:pin-filled' : 'tabler:pin'}
              label={password.pinned ? 'Unpin' : 'Pin'}
              onClick={() => {
                pinPassword(password.id)
              }}
            />
            <ContextMenuItem
              icon="tabler:pencil"
              label="Edit"
              onClick={handleEdit}
            />
            <ContextMenuItem
              dangerous
              icon="tabler:trash"
              label="Delete"
              onClick={handleDeletePassword}
            />
          </ContextMenu>
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

export default PasswordEntryItem
