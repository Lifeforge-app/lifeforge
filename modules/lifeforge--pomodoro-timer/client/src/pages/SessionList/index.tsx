import { useQuery } from '@tanstack/react-query'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  ContextMenu,
  ContextMenuItem,
  EmptyStateScreen,
  ModuleHeader,
  Scrollbar,
  WithQuery,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import ModifySessionModal from '@/modal/ModifySessionModal'
import SettingsModal from '@/modal/ModifySettingsModal'
import { usePomodoroSettings } from '@/providers/PomodoroSettingsProvider'

import SessionCard from './components/SessionCard'

export default function SessionList() {
  const { t } = useModuleTranslation()
  const { open } = useModalStore()
  const settings = usePomodoroSettings()
  const sessionsQuery = useQuery(forgeAPI.sessions.list.queryOptions())

  return (
    <>
      <ModuleHeader
        trailing={
          <>
            <Button
              icon="tabler:plus"
              tProps={{
                item: t('items.session')
              }}
              onClick={() => {
                open(ModifySessionModal, {
                  openType: 'create'
                })
              }}
            >
              New
            </Button>
            <ContextMenu>
              <ContextMenuItem
                icon="tabler:settings"
                label={t('tabs.settings')}
                onClick={() =>
                  open(SettingsModal, {
                    initialData: settings
                  })
                }
              />
            </ContextMenu>
          </>
        }
      />
      <WithQuery query={sessionsQuery}>
        {sessions =>
          sessions.length ? (
            <Scrollbar>
              <div className="space-y-3">
                {sessions.map(session => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            </Scrollbar>
          ) : (
            <EmptyStateScreen
              icon="tabler:clock-off"
              message={{
                id: 'session'
              }}
            />
          )
        }
      </WithQuery>
    </>
  )
}
