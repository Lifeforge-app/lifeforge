import React, { useState } from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import useFetch from '@hooks/useFetch'
import { type IAchievementEntry } from '@interfaces/achievements_interfaces'
import ModifyAchievementModal from './ModifyAchievementModal'

function Achievements(): React.ReactElement {
  const [selectedDifficulty, setSelectedDifficulty] = React.useState('easy')
  const [entries, refreshEntries] = useFetch<IAchievementEntry[]>(
    'achievements/entry/' + selectedDifficulty
  )
  const [modifyAchievementModalOpenType, setModifyAchievementModalOpenType] =
    useState<'create' | 'update' | null>(null)
  const [existedData, setExistedData] = useState<IAchievementEntry | null>(null)
  const [
    deleteAchievementConfirmationModalOpen,
    setDeleteAchievementConfirmationModalOpen
  ] = useState(false)

  return (
    <ModuleWrapper>
      <ModuleHeader
        title="Achievements"
        desc="..."
        actionButton={
          <Button
            icon="tabler:plus"
            onClick={() => {
              setExistedData(null)
              setModifyAchievementModalOpenType('create')
            }}
            className="ml-4"
          >
            Add Achievement
          </Button>
        }
      />
      <div className="mt-8 flex items-center">
        {[
          ['easy', 'border-green-500', 'text-green-500'],
          ['medium', 'border-yellow-500', 'text-yellow-500'],
          ['hard', 'border-red-500', 'text-red-500'],
          ['impossible', 'border-purple-500', 'text-purple-500']
        ].map((achievement, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedDifficulty(achievement[0])
            }}
            className={`w-full cursor-pointer border-b-2 p-2 uppercase tracking-widest transition-all ${
              selectedDifficulty === achievement[0]
                ? `${achievement[1]} ${achievement[2]} font-medium`
                : 'border-bg-500 text-bg-500 hover:border-bg-200 hover:text-bg-200'
            }`}
          >
            {achievement[0]}
          </button>
        ))}
      </div>
      <APIComponentWithFallback data={entries}>
        {typeof entries !== 'string' && entries.length > 0 ? (
          <div className="mt-8 flex flex-col gap-4">
            {entries.map((entry, index) => (
              <div
                key={index}
                className="flex items-start justify-between gap-4 rounded-lg bg-bg-900 p-4 shadow-lg"
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
                    onClick={() => {
                      setExistedData(entry)
                      setModifyAchievementModalOpenType('update')
                    }}
                    text="Edit"
                  />
                  <MenuItem
                    icon="tabler:trash"
                    onClick={() => {
                      setExistedData(entry)
                      setDeleteAchievementConfirmationModalOpen(true)
                    }}
                    text="Delete"
                    isRed
                  />
                </HamburgerMenu>
              </div>
            ))}
          </div>
        ) : (
          <EmptyStateScreen
            title="Oops! Nothing here."
            description="There are no achievements available for this difficulty."
            icon="tabler:award-off"
            ctaContent="Add achievement"
            setModifyModalOpenType={() => {
              setExistedData(null)
              setModifyAchievementModalOpenType('create')
            }}
          />
        )}
      </APIComponentWithFallback>
      <ModifyAchievementModal
        openType={modifyAchievementModalOpenType}
        setOpenType={setModifyAchievementModalOpenType}
        updateAchievementList={refreshEntries}
        existedData={existedData}
        currentDifficulty={selectedDifficulty}
      />
      <DeleteConfirmationModal
        apiEndpoint="achievements/entry"
        data={existedData}
        isOpen={deleteAchievementConfirmationModalOpen}
        itemName="achievement"
        onClose={() => {
          setExistedData(null)
          setDeleteAchievementConfirmationModalOpen(false)
        }}
        updateDataList={refreshEntries}
        nameKey="title"
      />
    </ModuleWrapper>
  )
}

export default Achievements
