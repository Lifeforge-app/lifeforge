import { useQuery } from '@tanstack/react-query'
import { encrypt } from '@utils/encryption'
import forgeAPI from '@utils/forgeAPI'
import { EmptyStateScreen, SearchInput } from 'lifeforge-ui'
import { WithQuery } from 'lifeforge-ui'
import { useState } from 'react'
import type { InferOutput } from 'shared'

import JournalListItem from './components/JournalListItem'

export type JournalEntry = InferOutput<
  typeof forgeAPI.journal.entries.list
>[number]

function JournalList({ masterPassword }: { masterPassword: string }) {
  const [searchQuery, setSearchQuery] = useState('')

  const challengeQuery = useQuery(
    forgeAPI.journal.auth.getChallenge.queryOptions({
      refetchInterval: 4 * 60 * 1000 // Refetch every 4 minutes
    })
  )

  const entriesQuery = useQuery(
    forgeAPI.journal.entries.list
      .input({
        master: encrypt(masterPassword, challengeQuery.data || '')
      })
      .queryOptions({
        enabled: challengeQuery.data !== undefined
      })
  )

  return (
    <>
      <div className="mt-6 mb-8 flex min-h-0 w-full flex-1 flex-col">
        <SearchInput
          namespace="modules.journal"
          searchTarget="entry"
          setValue={setSearchQuery}
          value={searchQuery}
        />
        <WithQuery query={entriesQuery}>
          {entries =>
            entries.length > 0 ? (
              <div className="mt-6 space-y-4 pb-8">
                {entries.map(entry => (
                  <JournalListItem
                    key={entry.id}
                    entry={entry}
                    masterPassword={masterPassword}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-6 flex-1">
                <EmptyStateScreen
                  icon="tabler:book-off"
                  name="entry"
                  namespace="modules.journal"
                />
              </div>
            )
          }
        </WithQuery>
      </div>
    </>
  )
}

export default JournalList
