import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import type { InferOutput } from '@lifeforge/shared'
import {
  Button,
  EmptyStateScreen,
  FAB,
  ModuleHeader,
  Stack,
  WithQuery,
  useModalStore
} from '@lifeforge/ui'

import forgeAPI from '@/forgeAPI'

import EntryItem from './components/EntryItem'
import ModifyAPIKeyModal from './modals/ModifyAPIKeyModal'

export type APIKeyEntry = InferOutput<
  typeof forgeAPI.apiKeys.entries.list
>[number]

function APIKeys() {
  const { open } = useModalStore()

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
            display={{ base: 'none', lg: 'flex' }}
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
          <Stack flex="1" mb={{ base: '3xl', lg: '2xl' }}>
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
          </Stack>
        )}
      </WithQuery>
      <FAB onClick={handleCreateAPIKey} />
    </>
  )
}

export default APIKeys
