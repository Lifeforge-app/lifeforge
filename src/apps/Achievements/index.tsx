import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Button,
  DeleteConfirmationModal,
  EmptyStateScreen,
  FAB,
  ModuleHeader,
  ModuleWrapper,
  QueryWrapper
} from '@lifeforge/ui'

import fetchAPI from '@utils/fetchAPI'

import ModifyAchievementModal from './ModifyAchievementModal'
import DifficultySelector from './components/DifficultySelector'
import EntryItem from './components/EntryItem'
import { type IAchievementEntry } from './interfaces/achievements_interfaces'

function Achievements() {
  const { t } = useTranslation('apps.achievements')
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<IAchievementEntry['difficulty']>('impossible')
  const entriesQuery = useQuery<IAchievementEntry[]>({
    queryKey: ['achievements/entries', selectedDifficulty],
    queryFn: () => fetchAPI(`achievements/entries/${selectedDifficulty}`)
  })

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
      <QueryWrapper query={entriesQuery}>
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
              namespace="apps.achievements"
              onCTAClick={() => {
                setExistedData(null)
                setModifyAchievementModalOpenType('create')
              }}
            />
          )
        }
      </QueryWrapper>
      <ModifyAchievementModal
        currentDifficulty={selectedDifficulty}
        existedData={existedData}
        openType={modifyAchievementModalOpenType}
        setOpenType={setModifyAchievementModalOpenType}
      />
      <DeleteConfirmationModal
        apiEndpoint="achievements/entries"
        data={existedData ?? undefined}
        isOpen={deleteAchievementConfirmationModalOpen}
        itemName="achievement"
        nameKey="title"
        queryKey={['achievements/entries', selectedDifficulty]}
        onClose={() => {
          setExistedData(null)
          setDeleteAchievementConfirmationModalOpen(false)
        }}
      />
      {entriesQuery.isSuccess && entriesQuery.data.length > 0 && (
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
