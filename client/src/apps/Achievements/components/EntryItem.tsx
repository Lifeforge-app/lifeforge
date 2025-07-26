import { Icon } from '@iconify/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import clsx from 'clsx'
import { ConfirmationModal, HamburgerMenu, MenuItem } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'

import type { IAchievement } from '..'
import ModifyAchievementModal from './ModifyAchievementModal'

function EntryItem({ entry }: { entry: IAchievement }) {
  const queryClient = useQueryClient()

  const open = useModalStore(state => state.open)

  const deleteMutation = useMutation(
    forgeAPI.achievements.entries.remove
      .input({
        id: entry.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['achievements']
          })
        }
      })
  )

  const handleDeleteEntry = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete Achievement',
      description: 'Are you sure you want to delete this achievement?',
      buttonType: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync({})
      }
    })
  }, [entry])

  return (
    <div className="shadow-custom component-bg flex items-start justify-between gap-3 rounded-lg p-4">
      <div className="flex h-full items-start gap-3">
        <div
          className={clsx(
            'flex-center size-12 shrink-0 rounded-md',
            {
              easy: 'border-2 border-green-500 bg-green-500/20 text-green-500',
              medium:
                'border-2 border-yellow-500 bg-yellow-500/20 text-yellow-500',
              hard: 'border-2 border-red-500 bg-red-500/20 text-red-500',
              impossible:
                'border-2 border-purple-500 bg-purple-500/20 text-purple-500'
            }[entry.difficulty]
          )}
        >
          <Icon className="size-8" icon="tabler:award" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{entry.title}</h2>
          <p className="text-bg-500 mt-1 text-sm whitespace-pre-wrap">
            {entry.thoughts}
          </p>
        </div>
      </div>
      <HamburgerMenu>
        <MenuItem
          icon="tabler:pencil"
          text="Edit"
          onClick={() => {
            open(ModifyAchievementModal, {
              type: 'update',
              initialData: entry,
              currentDifficulty: entry.difficulty
            })
          }}
        />
        <MenuItem
          isRed
          icon="tabler:trash"
          text="Delete"
          onClick={handleDeleteEntry}
        />
      </HamburgerMenu>
    </div>
  )
}

export default EntryItem
