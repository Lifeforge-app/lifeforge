import { t } from 'i18next'
import React, { useState } from 'react'
import { Button , FAB } from '@components/buttons'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import DeleteConfirmationModal from '@components/modals/DeleteConfirmationModal'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import useFetch from '@hooks/useFetch'
import { type IAchievementEntry } from '@interfaces/achievements_interfaces'
import DifficultySelector from './components/DifficultySelector'
import EntryItem from './components/EntryItem'
import ModifyAchievementModal from './ModifyAchievementModal'

function Achievements(): React.ReactElement {
  const [selectedDifficulty, setSelectedDifficulty] = React.useState('easy')
  const [entries, refreshEntries] = useFetch<IAchievementEntry[]>(
    'achievements/entries/' + selectedDifficulty
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
        icon="tabler:award"
        actionButton={
          <Button
            icon="tabler:plus"
            onClick={() => {
              setExistedData(null)
              setModifyAchievementModalOpenType('create')
            }}
            className="ml-4 hidden md:flex"
          >
            Add Achievement
          </Button>
        }
      />
      <DifficultySelector
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
      />
      <APIFallbackComponent data={entries}>
        {entries =>
          entries.length > 0 ? (
            <div className="mt-6 space-y-4">
              {entries.map(entry => (
                <EntryItem
                  key={entry.id}
                  entry={entry}
                  setExistedData={setExistedData}
                  setModifyAchievementModalOpenType={
                    setModifyAchievementModalOpenType
                  }
                  setDeleteAchievementConfirmationModalOpen={
                    setDeleteAchievementConfirmationModalOpen
                  }
                />
              ))}
            </div>
          ) : (
            <EmptyStateScreen
              title={t('emptyState.achievements.title')}
              description={t('emptyState.achievements.description')}
              icon="tabler:award-off"
              ctaContent="Add achievement"
              onCTAClick={() => {
                setExistedData(null)
                setModifyAchievementModalOpenType('create')
              }}
            />
          )
        }
      </APIFallbackComponent>
      <ModifyAchievementModal
        openType={modifyAchievementModalOpenType}
        setOpenType={setModifyAchievementModalOpenType}
        updateAchievementList={refreshEntries}
        existedData={existedData}
        currentDifficulty={selectedDifficulty}
      />
      <DeleteConfirmationModal
        apiEndpoint="achievements/entries"
        data={existedData}
        isOpen={deleteAchievementConfirmationModalOpen}
        itemName="achievement"
        onClose={() => {
          setExistedData(null)
          setDeleteAchievementConfirmationModalOpen(false)
        }}
        updateDataLists={refreshEntries}
        nameKey="title"
      />
      {typeof entries !== 'string' && entries.length > 0 && (
        <FAB
          onClick={() => {
            setExistedData(null)
            setModifyAchievementModalOpenType('create')
          }}
          hideWhen="md"
        />
      )}
    </ModuleWrapper>
  )
}

export default Achievements
