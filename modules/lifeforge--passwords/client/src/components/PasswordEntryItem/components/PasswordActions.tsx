import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import type React from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  ContextMenu,
  ContextMenuItem,
  toast,
  useModalStore
} from '@lifeforge/ui'

import ModifyPasswordModal from '@/components/modals/ModifyPasswordModal'
import { useCopyPassword, useDeletePassword, useRotatePassword } from '@/hooks'
import { useVEKContext } from '@/providers/VEKProvider'
import { decrypt } from '@/utils/crypto'

import type { PasswordEntry } from '../../..'

dayjs.extend(relativeTime)

function PasswordActions({
  password,
  decryptedPassword,
  decryptLoading,
  pinPassword,
  onDecrypt,
  setDecryptedPassword
}: {
  password: PasswordEntry
  decryptedPassword: string | null
  decryptLoading: boolean
  pinPassword: (id: string) => Promise<void>
  onDecrypt: () => Promise<void>
  setDecryptedPassword: React.Dispatch<React.SetStateAction<string | null>>
}) {
  const vek = useVEKContext()
  const { t } = useModuleTranslation()
  const { open } = useModalStore()
  const { copyPassword, copyLoading } = useCopyPassword()

  const { rotatePassword, rotateLoading } = useRotatePassword(
    password,
    setDecryptedPassword
  )

  const { handleDeletePassword } = useDeletePassword(password)

  async function handleEdit() {
    if (!vek) return

    try {
      const decrypted = await decrypt(password.password, vek)

      open(ModifyPasswordModal, {
        type: 'update',
        initialData: { ...password, decrypted },
        vek
      })
    } catch {
      toast.error(t('toasts.decryptFailed'))
    }
  }

  return (
    <>
      <Button
        display={{ base: 'none', sm: 'flex' }}
        icon={decryptedPassword === null ? 'tabler:eye' : 'tabler:eye-off'}
        loading={decryptLoading}
        p="sm"
        variant="plain"
        onClick={onDecrypt}
      />
      <Button
        display={{ base: 'none', sm: 'flex' }}
        icon="tabler:copy"
        loading={copyLoading}
        p="sm"
        variant="plain"
        onClick={() => copyPassword(password.password, decryptedPassword)}
      />
      <ContextMenu>
        <ContextMenuItem
          icon="tabler:rotate"
          label="Rotate Password"
          loading={rotateLoading}
          onClick={rotatePassword}
        />
        <ContextMenuItem
          className="flex sm:hidden"
          icon={decryptedPassword === null ? 'tabler:eye' : 'tabler:eye-off'}
          label={decryptedPassword === null ? 'Show Password' : 'Hide Password'}
          loading={decryptLoading}
          onClick={onDecrypt}
        />
        <ContextMenuItem
          className="flex sm:hidden"
          icon="tabler:copy"
          label="Copy Password"
          loading={copyLoading}
          onClick={() => copyPassword(password.password, decryptedPassword)}
        />
        <ContextMenuItem
          icon={password.pinned ? 'tabler:pin-filled' : 'tabler:pin'}
          label={password.pinned ? 'Unpin' : 'Pin'}
          onClick={() => pinPassword(password.id)}
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
    </>
  )
}

export default PasswordActions
