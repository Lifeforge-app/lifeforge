import { Icon } from '@iconify/react'
import dayjs from 'dayjs'
import { ContextMenu, ContextMenuItem, ItemWrapper } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'

import type { MomentVaultEntry } from '@apps/02.Lifestyle/MomentVault'
import ModifyTextEntryModal from '@apps/02.Lifestyle/MomentVault/modals/ModifyTextEntryModal'

function TextEntry({
  entry,
  onDelete
}: {
  entry: MomentVaultEntry
  onDelete: () => void
}) {
  const open = useModalStore(state => state.open)

  const handleUpdateEntry = useCallback(() => {
    open(ModifyTextEntryModal, {
      initialData: entry
    })
  }, [entry])

  return (
    <ItemWrapper as="li">
      <div className="mr-16">
        <div className="border-custom-500 border-l-4 pl-4">
          <p className="text-bg-500 whitespace-pre-wrap">{entry.content}</p>
        </div>
        <p className="text-bg-500 mt-4 flex items-center gap-2">
          <Icon icon="tabler:clock" /> {dayjs(entry.created).fromNow()}
        </p>
      </div>
      <ContextMenu classNames={{ wrapper: 'absolute top-4 right-4' }}>
        <ContextMenuItem
          icon="tabler:pencil"
          label="Edit"
          onClick={handleUpdateEntry}
        />
        <ContextMenuItem
          dangerous
          icon="tabler:trash"
          label="Delete"
          onClick={onDelete}
        />
      </ContextMenu>
    </ItemWrapper>
  )
}

export default TextEntry
