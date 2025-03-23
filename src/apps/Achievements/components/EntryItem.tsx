import { Icon } from '@iconify/react/dist/iconify.js'
import clsx from 'clsx'

import { HamburgerMenu, MenuItem } from '@lifeforge/ui'

import useComponentBg from '@hooks/useComponentBg'

import { type IAchievementEntry } from '../interfaces/achievements_interfaces'

function EntryItem({
  entry,
  setExistedData,
  setModifyAchievementModalOpenType,
  setDeleteAchievementConfirmationModalOpen
}: {
  entry: IAchievementEntry
  setExistedData: React.Dispatch<React.SetStateAction<IAchievementEntry | null>>
  setModifyAchievementModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setDeleteAchievementConfirmationModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
}) {
  const { componentBg } = useComponentBg()

  return (
    <div
      className={clsx(
        'shadow-custom flex items-start justify-between gap-4 rounded-lg p-4',
        componentBg
      )}
    >
      <div className="flex h-full items-center gap-4">
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
            setExistedData(entry)
            setModifyAchievementModalOpenType('update')
          }}
        />
        <MenuItem
          isRed
          icon="tabler:trash"
          text="Delete"
          onClick={() => {
            setExistedData(entry)
            setDeleteAchievementConfirmationModalOpen(true)
          }}
        />
      </HamburgerMenu>
    </div>
  )
}

export default EntryItem
