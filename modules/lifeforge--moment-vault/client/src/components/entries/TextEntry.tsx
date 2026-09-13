import type { MomentVaultEntry } from '@'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useCallback } from 'react'

import {
  Card,
  ContextMenu,
  ContextMenuItem,
  Icon,
  useModalStore
} from '@lifeforge/ui'

import ModifyTextEntryModal from '@/modals/ModifyTextEntryModal'

dayjs.extend(relativeTime)

function TextEntry({
  entry,
  onDelete
}: {
  entry: MomentVaultEntry
  onDelete: () => void
}) {
  const { open } = useModalStore()

  const handleUpdateEntry = useCallback(() => {
    open(ModifyTextEntryModal, {
      initialData: entry
    })
  }, [entry])

  return (
    <Card as="li">
      <div className="mr-16">
        <div className="border-custom-500 border-l-4 pl-4">
          <p className="text-bg-500 whitespace-pre-wrap">{entry.content}</p>
        </div>
        <p className="text-bg-500 mt-4 flex items-center gap-2">
          <Icon icon="tabler:clock" /> {dayjs(entry.created).fromNow()}
        </p>
      </div>
      <ContextMenu className="absolute top-4 right-4">
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
    </Card>
  )
}

export default TextEntry
