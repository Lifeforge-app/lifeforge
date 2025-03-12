import { Icon } from '@iconify/react'
import { decrypt, encrypt } from '@utils/encryption'
import fetchAPI from '@utils/fetchAPI'
import copy from 'copy-to-clipboard'
import moment from 'moment'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

import { Button, ConfigColumn, HamburgerMenu, MenuItem } from '@lifeforge/ui'

import { type IAPIKeyEntry } from '../interfaces/api_keys_interfaces'
import { fetchChallenge } from '../utils/fetchChallenge'

function EntryItem({
  entry,
  hasDivider,
  setExistingData,
  setModifyAPIKeyModalOpenType,
  setDeleteConfirmationModalOpen,
  masterPassword
}: {
  entry: IAPIKeyEntry
  hasDivider: boolean
  setExistingData: React.Dispatch<React.SetStateAction<IAPIKeyEntry | null>>
  setModifyAPIKeyModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setDeleteConfirmationModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  masterPassword: string
}): React.ReactElement {
  const [isCopying, setIsCopying] = useState(false)
  async function copyKey(): Promise<void> {
    const challenge = await fetchChallenge()
    setIsCopying(true)

    try {
      const data = await fetchAPI<string>(
        `api-keys/${entry.id}?master=${encodeURIComponent(
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
          Last updated: {moment(entry.updated).fromNow()}
        </span>
      </div>
      <div className="ml-2 flex gap-2">
        <Button
          className="p-2!"
          icon="tabler:copy"
          loading={isCopying}
          variant="no-bg"
          onClick={() => {
            copyKey().catch(console.error)
          }}
        />
        <HamburgerMenu className="relative">
          <MenuItem
            icon="tabler:pencil"
            text="edit"
            onClick={() => {
              setExistingData(entry)
              setModifyAPIKeyModalOpenType('update')
            }}
          />
          <MenuItem
            isRed
            icon="tabler:trash"
            text="delete"
            onClick={() => {
              setDeleteConfirmationModalOpen(true)
              setExistingData(entry)
            }}
          />
        </HamburgerMenu>
      </div>
    </ConfigColumn>
  )
}

export default EntryItem
