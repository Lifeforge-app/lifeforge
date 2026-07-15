import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import {
  Button,
  EmptyStateScreen,
  FAB,
  ModuleHeader,
  Stack,
  WithQuery,
  useModalStore
} from '@lifeforge/ui'

import forgeAPI from '@/core/utils/forgeAPI'

import BackupItem from './components/BackupItem'
import CreateBackupModal from './components/CreateBackupModal'

function Backups() {
  const { t } = useTranslation('common.backups')
  const { open } = useModalStore()
  const backupsQuery = useQuery(forgeAPI.backups.list.queryOptions())

  return (
    <>
      <ModuleHeader
        actionButton={
          <Button
            display={{ base: 'none', sm: 'flex' }}
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
        totalItems={backupsQuery.data?.length ?? 0}
      />
      <WithQuery query={backupsQuery}>
        {data =>
          data.length > 0 ? (
            <Stack as="ul">
              {data.map(backup => (
                <BackupItem key={backup.key} backup={backup} />
              ))}
            </Stack>
          ) : (
            <EmptyStateScreen
              icon="tabler:history-off"
              message={{
                id: 'noBackups',
                namespace: 'common.backups'
              }}
            />
          )
        }
      </WithQuery>
      <FAB
        onClick={() => {
          open(CreateBackupModal, {})
        }}
      />
    </>
  )
}

export default Backups
