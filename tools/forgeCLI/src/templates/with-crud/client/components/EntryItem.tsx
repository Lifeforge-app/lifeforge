import type { Entry } from '@'
import forgeAPI from '@/utils/forgeAPI'
import { Icon } from '@iconify/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import {
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  Card,
  useModalStore
} from 'lifeforge-ui'
import { toast } from 'react-toastify'

import ModifyEntryModal from './ModifyEntryModal'

function EntryItem({ entry }: { entry: Entry }) {
  const queryClient = useQueryClient()

  const open = useModalStore(state => state.open)

  const deleteMutation = useMutation(
    forgeAPI.{{camel moduleName.en}}.entries.remove
      .input({
        id: entry.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['{{camel moduleName.en}}', 'entries'] })
        },
        onError: error => {
          toast.error(`Failed to delete entry: ${error.message}`)
        }
      })
  )

  const handleEditEntry = () => {
    open(ModifyEntryModal, {
      openType: 'update',
      initialData: entry
    })
  }

  const handleDeleteEntry = () => {
    open(ConfirmationModal, {
      title: 'Delete Entry',
      description: `Are you sure you want to delete the entry "${entry.name}"? This action cannot be undone.`,
      confirmationButton: 'delete',
      onConfirm: async () => {
        deleteMutation.mutateAsync({})
      }
    })
  }

  return (
    <Card className="flex-between! gap-8">
      <div className="flex items-center gap-3">
        <div
          className="flex-center size-12 rounded-lg"
          style={{curlyOpen}}{{curlyOpen}}
            backgroundColor: entry.color + '33',
            color: entry.color
          {{curlyClose}}{{curlyClose}}
        >
          <Icon className="size-6" icon={entry.icon || 'tabler:cube'} />
        </div>
        <div>
          <div className="font-medium">{entry.name}</div>
          <div className="text-bg-500 text-sm">
            Created {dayjs(entry.created).format('MMM D, YYYY')}
          </div>
        </div>
      </div>
      <ContextMenu>
        <ContextMenuItem
          icon="tabler:pencil"
          label="Edit"
          onClick={handleEditEntry}
        />
        <ContextMenuItem
          dangerous
          icon="tabler:trash"
          label="Delete"
          onClick={handleDeleteEntry}
        />
      </ContextMenu>
    </Card>
  )
}

export default EntryItem
