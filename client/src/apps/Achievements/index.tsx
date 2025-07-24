import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/server'
import {
  Button,
  EmptyStateScreen,
  FAB,
  ModuleHeader,
  ModuleWrapper,
  QueryWrapper
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import DifficultySelector from './components/DifficultySelector'
import EntryItem from './components/EntryItem'
import ModifyAchievementModal from './components/ModifyAchievementModal'

function Achievements() {
  const { t } = useTranslation('apps.achievements')

  const open = useModalStore(state => state.open)

  const [selectedDifficulty, setSelectedDifficulty] = useState<I>('impossible')

  const entriesQuery = useQuery(
    forgeAPI
      .route('/achievements')
      .route('/entries')
      .controller('GET /:difficulty')
      .input({
        params: {
          difficulty: selectedDifficulty
        }
      })
      .getQueryOptions()
  )

  console.log()

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
              open(ModifyAchievementModal, {
                type: 'create',
                existedData: null,
                currentDifficulty: selectedDifficulty
              })
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
                <EntryItem key={entry.id} entry={entry} />
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
                open(ModifyAchievementModal, {
                  type: 'create',
                  existedData: null,
                  currentDifficulty: selectedDifficulty
                })
              }}
            />
          )
        }
      </QueryWrapper>
      {entriesQuery.isSuccess && entriesQuery.data.length > 0 && (
        <FAB
          hideWhen="md"
          onClick={() => {
            open(ModifyAchievementModal, {
              type: 'create',
              existedData: null,
              currentDifficulty: selectedDifficulty
            })
          }}
        />
      )}
    </ModuleWrapper>
  )
}

export default Achievements
