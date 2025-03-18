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
      <div className="flex h-full gap-4">
        <div
          className={clsx(
            'h-full w-1 shrink-0 rounded-full',
            {
              easy: 'bg-green-500',
              medium: 'bg-yellow-500',
              hard: 'bg-red-500',
              impossible: 'bg-purple-500'
            }[entry.difficulty]
          )}
        />
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
