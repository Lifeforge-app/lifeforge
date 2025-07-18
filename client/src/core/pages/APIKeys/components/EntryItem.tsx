import { Icon } from '@iconify/react'
import copy from 'copy-to-clipboard'
import dayjs from 'dayjs'
import {
  Button,
  ConfigColumn,
  DeleteConfirmationModal,
  HamburgerMenu,
  MenuItem
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

import { fetchAPI } from 'shared/lib'

import { decrypt, encrypt } from '../../../security/utils/encryption'
import { type IAPIKeyEntry } from '../interfaces/api_keys_interfaces'
import ModifyAPIKeyModal from '../modals/ModifyAPIKeyModal'

function EntryItem({
  entry,
  hasDivider,
  masterPassword
}: {
  entry: IAPIKeyEntry
  hasDivider: boolean
  masterPassword: string
}) {
  const open = useModalStore(state => state.open)

  const [isCopying, setIsCopying] = useState(false)

  async function copyKey() {
    const challenge = await fetchAPI<string>(
      import.meta.env.VITE_API_HOST,
      'api-keys/auth/challenge'
    )

    setIsCopying(true)

    try {
      const data = await fetchAPI<string>(
        import.meta.env.VITE_API_HOST,
        `api-keys/entries/${entry.id}?master=${encodeURIComponent(
          encrypt(masterPassword, challenge)
        )}`
      )

      const decryptedKey = decrypt(data, challenge)

      const decryptedSecondTime = decrypt(decryptedKey, masterPassword)

      copy(decryptedSecondTime)
      toast.success('Key copied to clipboard')
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch key')
    } finally {
      setIsCopying(false)
    }
  }

  const handleUpdateEntry = useCallback(async () => {
    open(ModifyAPIKeyModal, {
      type: 'update',
      existedData: entry,
      masterPassword
    })
  }, [entry, masterPassword])

  const handleDeleteEntry = useCallback(() => {
    open(DeleteConfirmationModal, {
      apiEndpoint: 'api-keys/entries',
      confirmationText: 'Delete this API key',
      data: entry,
      itemName: 'API Key',
      nameKey: 'name',
      queryKey: ['api-keys', 'entries', masterPassword]
    })
  }, [entry, masterPassword])

  return (
    <ConfigColumn
      key={entry.id}
      desc={entry.description}
      hasDivider={hasDivider}
      icon={entry.icon}
      title={
        <>
          {entry.name}
          <code className="text-bg-500 text-sm">({entry.keyId})</code>
        </>
      }
    >
      <div className="w-full">
        <code className="flex items-center gap-1 text-lg md:justify-end">
          {Array(12)
            .fill(0)
            .map((_, i) => (
              <Icon key={i} className="size-1" icon="tabler:circle-filled" />
            ))}
          <span className="ml-0.5">{entry.key}</span>
        </code>
        <span className="text-bg-500 text-sm">
          Last updated: {dayjs(entry.updated).fromNow()}
        </span>
      </div>
      <div className="ml-2 flex gap-2">
        <Button
          className="p-2!"
          icon="tabler:copy"
          loading={isCopying}
          variant="plain"
          onClick={() => {
            copyKey().catch(console.error)
          }}
        />
        <HamburgerMenu>
          <MenuItem
            icon="tabler:pencil"
            text="edit"
            onClick={handleUpdateEntry}
          />
          <MenuItem
            isRed
            icon="tabler:trash"
            text="delete"
            onClick={handleDeleteEntry}
          />
        </HamburgerMenu>
      </div>
    </ConfigColumn>
  )
}

export default EntryItem
