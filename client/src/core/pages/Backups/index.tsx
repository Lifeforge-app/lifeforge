import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import {
  Button,
  EmptyStateScreen,
  FAB,
  ModuleHeader,
  ModuleWrapper,
  WithQuery,
  useModalStore
} from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import BackupItem from './components/BackupItem'
import CreateBackupModal from './components/CreateBackupModal'

function Backups() {
  const { t } = useTranslation('core.backups')

  const open = useModalStore(state => state.open)

  const backupsQuery = useQuery(forgeAPI.backups.list.queryOptions())

  return (
    <ModuleWrapper>
      <ModuleHeader
        actionButton={
          <Button
            className="hidden sm:flex"
            icon="tabler:plus"
            tProps={{
              item: t('items.backup')
            }}
            onClick={() => {
              open(CreateBackupModal, {})
            }}
          >
            new
          </Button>
        }
        icon="tabler:history"
        title="Backups"
        totalItems={backupsQuery.data?.length ?? 0}
      />
      <div className="flex-1">
        <WithQuery query={backupsQuery}>
          {data =>
            data.length > 0 ? (
              <ul className="flex flex-col gap-3">
                {data.map(backup => (
                  <BackupItem key={backup.key} backup={backup} />
                ))}
              </ul>
            ) : (
              <EmptyStateScreen
                icon="tabler:history-off"
                name="noBackups"
                namespace="core.backups"
              />
            )
          }
        </WithQuery>
      </div>
      <FAB
        onClick={() => {
          open(CreateBackupModal, {})
        }}
      />
    </ModuleWrapper>
  )
}

export default Backups
