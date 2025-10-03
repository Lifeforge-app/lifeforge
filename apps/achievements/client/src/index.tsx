import forgeAPI from '@/utils/forgeAPI'
import {
  Button,
  EmptyStateScreen,
  FAB,
  ModuleHeader,
  Tabs,
  WithQueryData
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { parseAsStringEnum, useQueryState } from 'nuqs'
import { useTranslation } from 'react-i18next'
import type { InferOutput } from 'shared'
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

  const [difficulty, setDifficulty] = useQueryState(
    'difficulty',
    parseAsStringEnum(Object.keys(DIFFICULTIES)).withDefault('easy')
  )

  const handleCreateAchievement = () => {
    open(ModifyAchievementModal, {
      modifyType: 'create',
      currentDifficulty: difficulty
    })
  }

  return (
    <>
      <ModuleHeader
        actionButton={
          <Button
            className="ml-4 hidden md:flex"
            icon="tabler:plus"
            namespace="apps.achievements"
            tProps={{
              item: t('items.achievement')
            }}
            onClick={handleCreateAchievement}
          >
            new
          </Button>
        }
      />
      <Tabs
        active={difficulty}
        className="mb-6"
        enabled={Object.keys(DIFFICULTIES).map(
          difficulty => difficulty as keyof typeof DIFFICULTIES
        )}
        items={Object.keys(DIFFICULTIES).map(difficulty => ({
          id: difficulty,
          name: t(`difficulties.${difficulty}`),
          color: DIFFICULTIES[difficulty as keyof typeof DIFFICULTIES]
        }))}
        onNavClick={id => {
          setDifficulty(id as Achievement['difficulty'])
        }}
      />
      <WithQueryData
        controller={forgeAPI.achievements.entries.list.input({
          difficulty: difficulty as Achievement['difficulty']
        })}
      >
        {entries =>
          entries.length ? (
            <>
              <ul className="space-y-3">
                {entries.map(entry => (
                  <EntryItem key={entry.id} entry={entry} />
                ))}
              </ul>
              <FAB
                visibilityBreakpoint="md"
                onClick={handleCreateAchievement}
              />
            </>
          ) : (
            <EmptyStateScreen
              icon="tabler:award-off"
              name="achievement"
              namespace="apps.achievements"
            />
          )
        }
      </WithQueryData>
    </>
  )
}

export default Achievements
