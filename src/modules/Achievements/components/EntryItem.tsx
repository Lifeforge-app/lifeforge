import React from 'react'
import HamburgerMenu from '@components/buttons/HamburgerMenu'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import useThemeColors from '@hooks/useThemeColor'
import { type IAchievementEntry } from '@interfaces/achievements_interfaces'

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
}): React.ReactElement {
  const { componentBg } = useThemeColors()

  return (
    <div
      className={`flex items-start justify-between gap-4 rounded-lg p-4 shadow-custom ${componentBg}`}
    >
      <div className="flex h-full gap-4">
        <div
          className={`h-full w-1 shrink-0 rounded-full ${
            {
              easy: 'bg-green-500',
              medium: 'bg-yellow-500',
              hard: 'bg-red-500',
              impossible: 'bg-purple-500'
            }[entry.difficulty]
          }`}
        />
        <div>
          <h2 className="text-lg font-semibold">{entry.title}</h2>
          <p className="mt-1 text-sm text-bg-500">{entry.thoughts}</p>
        </div>
      </div>
      <HamburgerMenu className="relative">
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
