import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { DeleteConfirmationModal, HamburgerMenu, MenuItem } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'

import { AchievementsCollectionsSchemas, ISchemaWithPB } from 'shared/types'

import ModifyAchievementModal from './ModifyAchievementModal'

function EntryItem({
  entry
}: {
  entry: ISchemaWithPB<AchievementsCollectionsSchemas.IEntry>
}) {
  const open = useModalStore(state => state.open)

  const handleDeleteEntry = useCallback(() => {
    open(DeleteConfirmationModal, {
      apiEndpoint: 'achievements/entries',
      data: entry,
      itemName: 'achievement',
      nameKey: 'title' as const,
      queryKey: ['achievements/entries', entry.difficulty]
    })
  }, [entry])

  return (
    <div className="shadow-custom component-bg flex items-start justify-between gap-3 rounded-lg p-4">
      <div className="flex h-full items-center gap-3">
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
          <p className="text-bg-500 mt-1 text-sm">{entry.thoughts}</p>
        </div>
      </div>
      <HamburgerMenu>
        <MenuItem
          icon="tabler:pencil"
          text="Edit"
          onClick={() => {
            open(ModifyAchievementModal, {
              type: 'update',
              existedData: entry,
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
