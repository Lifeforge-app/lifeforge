import { useQuery } from '@tanstack/react-query'
import {
  Button,
  EmptyStateScreen,
  FAB,
  ModuleHeader,
  WithQuery,
  useModalStore
} from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { type InferOutput } from 'shared'

import forgeAPI from '@/utils/forgeAPI'

import EntryItem from './components/EntryItem'
import ModifyAPIKeyModal from './modals/ModifyAPIKeyModal'

export type APIKeysEntry = InferOutput<
  typeof forgeAPI.apiKeys.entries.list
>[number]

function APIKeys() {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('common.apiKeys')

  const entriesQuery = useQuery(forgeAPI.apiKeys.entries.list.queryOptions())

  const handleCreateAPIKey = () => {
    open(ModifyAPIKeyModal, {
      type: 'create'
    })
  }

  return (
    <>
      <ModuleHeader
        actionButton={
          <Button
            className="hidden lg:flex"
            icon="tabler:plus"
            tProps={{
              item: t('common.apiKeys:items.apiKey')
            }}
            onClick={handleCreateAPIKey}
          >
            new
          </Button>
        }
      />
      <WithQuery query={entriesQuery}>
        {entries => (
          <div className="mt-6 mb-24 h-full flex-1 space-y-3 lg:mb-12">
            {entries.length > 0 ? (
              entries.map(entry => <EntryItem key={entry.id} entry={entry} />)
            ) : (
              <EmptyStateScreen
                icon="tabler:key-off"
                message={{
                  id: 'apiKeys',
                  namespace: 'common.apiKeys'
                }}
              />
            )}
          </div>
        )}
      </WithQuery>
      <FAB onClick={handleCreateAPIKey} />
    </>
  )
}

export default APIKeys
