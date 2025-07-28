import { Icon } from '@iconify/react'
import dayjs from 'dayjs'
import { HamburgerMenu, MenuItem } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'

import type { MomentVaultEntry } from '@apps/MomentVault'
import ModifyTextEntryModal from '@apps/MomentVault/modals/ModifyTextEntryModal'

function TextEntry({
  entry,
  onDelete
}: {
  entry: MomentVaultEntry
  onDelete: () => void
}) {
  const open = useModalStore(state => state.open)

  const handleUpdateEntry = useCallback(() => {
    open(ModifyTextEntryModal, {})
  }, [entry])

  return (
    <div
      className="shadow-custom component-bg relative w-full gap-6 rounded-md p-6"
      id={`audio-entry-${entry.id}`}
    >
      <div className="mr-16">
        <div className="border-custom-500 border-l-4 pl-4">
          <p className="text-bg-500 whitespace-pre-wrap">{entry.content}</p>
        </div>
        <p className="text-bg-500 mt-4 flex items-center gap-2">
          <Icon icon="tabler:clock" /> {dayjs(entry.created).fromNow()}
        </p>
      </div>
      <HamburgerMenu classNames={{ wrapper: 'absolute top-4 right-4' }}>
        <MenuItem
          icon="tabler:pencil"
          text="Edit"
          onClick={handleUpdateEntry}
        />
        <MenuItem isRed icon="tabler:trash" text="Delete" onClick={onDelete} />
      </HamburgerMenu>
    </div>
  )
}

export default TextEntry
