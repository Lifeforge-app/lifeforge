import forgeAPI from '@/utils/forgeAPI'
import { useQuery } from '@tanstack/react-query'
import {
  Button,
  ContentWrapperWithSidebar,
  EmptyStateScreen,
  FAB,
  LayoutWithSidebar,
  ModuleHeader,
  Scrollbar,
  WithQuery
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import type { InferOutput } from 'shared'
import colors from 'tailwindcss/colors'

import EntryItem from './components/EntryItem'
import InnerHeader from './components/InnerHeader'
import Sidebar from './components/Sidebar'
import ModifyAchievementModal from './components/modals/ModifyAchievementModal'
import useFilter from './hooks/useFilter'

export type Achievement = InferOutput<
  typeof forgeAPI.achievements.entries.list
>[number]

export type AchievementCategory = InferOutput<
  typeof forgeAPI.achievements.categories.list
>[number]

export const DIFFICULTIES = {
  easy: colors.green[500],
  medium: colors.yellow[500],
  hard: colors.red[500],
  impossible: colors.purple[500]
}

function Achievements() {
  const { t } = useTranslation('apps.achievements')

  const open = useModalStore(state => state.open)

  const { filter, searchQuery } = useFilter()

  const entriesQuery = useQuery(
    forgeAPI.achievements.entries.list
      .input({
        difficulty:
          (filter.difficulty as Achievement['difficulty']) || undefined,
        category: filter.category || undefined,
        query: searchQuery || undefined
      })
      .queryOptions()
  )

  const handleCreateAchievement = () => {
    open(ModifyAchievementModal, {
      modifyType: 'create'
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
      <LayoutWithSidebar>
        <Sidebar />
        <ContentWrapperWithSidebar>
          <InnerHeader totalItemsCount={entriesQuery.data?.length || 0} />
          <WithQuery query={entriesQuery}>
            {entries =>
              entries.length ? (
                <Scrollbar className="mt-6">
                  <ul className="mb-8 space-y-3">
                    {entries.map(entry => (
                      <EntryItem key={entry.id} entry={entry} />
                    ))}
                  </ul>
                  <FAB
                    visibilityBreakpoint="md"
                    onClick={handleCreateAchievement}
                  />
                </Scrollbar>
              ) : (
                <EmptyStateScreen
                  icon="tabler:award-off"
                  message={{
                    id: 'achievements',
                    namespace: 'apps.achievements'
                  }}
                />
              )
            }
          </WithQuery>
        </ContentWrapperWithSidebar>
      </LayoutWithSidebar>
    </>
  )
}

export default Achievements
