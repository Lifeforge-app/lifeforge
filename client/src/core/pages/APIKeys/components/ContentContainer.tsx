import { useQuery } from '@tanstack/react-query'
import { encrypt } from '@utils/encryption'
import forgeAPI from '@utils/forgeAPI'
import {
  Button,
  EmptyStateScreen,
  FAB,
  ModuleHeader,
  WithQuery,
  useModalStore
} from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import type { InferOutput } from 'shared'

import ModifyAPIKeyModal from '../modals/ModifyAPIKeyModal'
import EntryItem from './EntryItem'

export type APIKeysEntry = InferOutput<
  typeof forgeAPI.apiKeys.entries.list
>[number]

function ContentContainer({ masterPassword }: { masterPassword: string }) {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('core.apiKeys')

  const challengeQuery = useQuery(
    forgeAPI.apiKeys.auth.getChallenge.queryOptions()
  )

  const entriesQuery = useQuery(
    forgeAPI.apiKeys.entries.list
      .input({
        master: encrypt(masterPassword, challengeQuery.data || '')
      })
      .queryOptions({
        enabled: challengeQuery.isSuccess
      })
  )

  const handleCreateAPIKey = () => {
    open(ModifyAPIKeyModal, {
      masterPassword,
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
              item: t('core.apiKeys:items.apiKey')
            }}
            onClick={handleCreateAPIKey}
          >
            new
          </Button>
        }
      />
      <WithQuery query={entriesQuery}>
        {entries => (
          <div className="mt-6 mb-24 flex-1 space-y-3 lg:mb-12">
            {entries.length > 0 ? (
              entries.map(entry => (
                <EntryItem
                  key={entry.id}
                  entry={entry}
                  masterPassword={masterPassword}
                />
              ))
            ) : (
              <EmptyStateScreen
                icon="tabler:key-off"
                name="apiKeys"
                namespace="core.apiKeys"
              />
            )}
          </div>
        )}
      </WithQuery>
      <FAB onClick={handleCreateAPIKey} />
    </>
  )
}

export default ContentContainer
