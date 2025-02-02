import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, FAB } from '@components/buttons'
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
  const { t } = useTranslation('modules.achievements')
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
        actionButton={
          <Button
            className="ml-4 hidden md:flex"
            icon="tabler:plus"
            tProps={{
              item: t('items.achievement')
            }}
            onClick={() => {
              setExistedData(null)
              setModifyAchievementModalOpenType('create')
            }}
          >
            new
          </Button>
        }
        icon="tabler:award"
        title="Achievements"
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
                  setDeleteAchievementConfirmationModalOpen={
                    setDeleteAchievementConfirmationModalOpen
                  }
                  setExistedData={setExistedData}
                  setModifyAchievementModalOpenType={
                    setModifyAchievementModalOpenType
                  }
                />
              ))}
            </div>
          ) : (
            <EmptyStateScreen
              ctaContent="new"
              ctaTProps={{ item: t('items.achievement') }}
              icon="tabler:award-off"
              name="achievement"
              namespace="modules.achievements"
              onCTAClick={() => {
                setExistedData(null)
                setModifyAchievementModalOpenType('create')
              }}
            />
          )
        }
      </APIFallbackComponent>
      <ModifyAchievementModal
        currentDifficulty={selectedDifficulty}
        existedData={existedData}
        openType={modifyAchievementModalOpenType}
        setOpenType={setModifyAchievementModalOpenType}
        updateAchievementList={refreshEntries}
      />
      <DeleteConfirmationModal
        apiEndpoint="achievements/entries"
        data={existedData}
        isOpen={deleteAchievementConfirmationModalOpen}
        itemName="achievement"
        nameKey="title"
        updateDataLists={refreshEntries}
        onClose={() => {
          setExistedData(null)
          setDeleteAchievementConfirmationModalOpen(false)
        }}
      />
      {typeof entries !== 'string' && entries.length > 0 && (
        <FAB
          hideWhen="md"
          onClick={() => {
            setExistedData(null)
            setModifyAchievementModalOpenType('create')
          }}
        />
      )}
    </ModuleWrapper>
  )
}

export default Achievements
