import forgeAPI from '@utils/forgeAPI'
import {
  Button,
  EmptyStateScreen,
  FAB,
  ModuleHeader,
  ModuleWrapper,
  Tabs,
  WithQueryData
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { InferInput, InferOutput } from 'shared'
import colors from 'tailwindcss/colors'

import EntryItem from './components/EntryItem'
import ModifyAchievementModal from './components/ModifyAchievementModal'

export type Achievement = InferOutput<
  typeof forgeAPI.achievements.entries.list
>[number]

const DIFFICULTIES = {
  easy: colors.green[500],
  medium: colors.yellow[500],
  hard: colors.red[500],
  impossible: colors.purple[500]
}

function Achievements() {
  const { t } = useTranslation('apps.achievements')

  const open = useModalStore(state => state.open)

  const [selectedDifficulty, setSelectedDifficulty] =
    useState<
      InferInput<
        typeof forgeAPI.achievements.entries.list
      >['query']['difficulty']
    >('impossible')

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
                modifyType: 'create',
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
      <div className="flex flex-1 flex-col gap-4">
        <Tabs
          active={selectedDifficulty}
          enabled={Object.keys(DIFFICULTIES).map(
            difficulty => difficulty as keyof typeof DIFFICULTIES
          )}
          items={Object.keys(DIFFICULTIES).map(difficulty => ({
            id: difficulty,
            name: t(`difficulties.${difficulty}`),
            color: DIFFICULTIES[difficulty as keyof typeof DIFFICULTIES]
          }))}
          onNavClick={id => {
            setSelectedDifficulty(id as Achievement['difficulty'])
          }}
        />
        <WithQueryData
          controller={forgeAPI.achievements.entries.list.input({
            difficulty: selectedDifficulty
          })}
        >
          {entries =>
            entries.length > 0 ? (
              <>
                <div className="space-y-3">
                  {entries.map(entry => (
                    <EntryItem key={entry.id} entry={entry} />
                  ))}
                </div>
                <FAB
                  visibilityBreakpoint="md"
                  onClick={() => {
                    open(ModifyAchievementModal, {
                      modifyType: 'create',
                      currentDifficulty: selectedDifficulty
                    })
                  }}
                />
              </>
            ) : (
              <EmptyStateScreen
                CTAButtonProps={{
                  children: 'new',
                  icon: 'tabler:plus',
                  tProps: { item: t('items.achievement') },
                  onClick: () => {
                    open(ModifyAchievementModal, {
                      modifyType: 'create',
                      currentDifficulty: selectedDifficulty
                    })
                  }
                }}
                icon="tabler:award-off"
                name="achievement"
                namespace="apps.achievements"
              />
            )
          }
        </WithQueryData>
      </div>
    </ModuleWrapper>
  )
}

export default Achievements
