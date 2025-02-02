import { Icon } from '@iconify/react'
import moment from 'moment'
import React from 'react'
import HamburgerMenu from '@components/buttons/HamburgerMenu'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import ConfigColumn from '@components/utilities/ConfigColumn'
import { type IAPIKeyEntry } from '@interfaces/api_keys_interfaces'

function EntryItem({
  entry,
  hasDivider,
  setExistingData,
  setModifyAPIKeyModalOpenType,
  setDeleteConfirmationModalOpen
}: {
  entry: IAPIKeyEntry
  hasDivider: boolean
  setExistingData: React.Dispatch<React.SetStateAction<IAPIKeyEntry | null>>
  setModifyAPIKeyModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setDeleteConfirmationModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
  return (
    <ConfigColumn
      key={entry.id}
      desc={entry.description}
      hasDivider={hasDivider}
      icon={entry.icon}
      title={
        <>
          {entry.name}
          <span className="text-sm text-bg-500">({entry.keyId})</span>
        </>
      }
    >
      <div>
        <code className="flex items-center justify-end gap-1 text-lg">
          {Array(12)
            .fill(0)
            .map((_, i) => (
              <Icon key={i} className="size-1" icon="tabler:circle-filled" />
            ))}
          <span className="ml-0.5">{entry.key}</span>
        </code>
        <span className="text-sm text-bg-500">
          Last updated: {moment(entry.updated).fromNow()}
        </span>
      </div>
      <HamburgerMenu className="relative ml-2">
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
    </ConfigColumn>
  )
}

export default EntryItem
