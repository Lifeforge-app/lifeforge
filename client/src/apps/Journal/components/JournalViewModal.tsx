import { useQuery } from '@tanstack/react-query'
import { encrypt } from '@utils/encryption'
import forgeAPI from '@utils/forgeAPI'
import { ModalHeader, WithQuery } from 'lifeforge-ui'

import JournalView from './JournalView'

function JournalViewModal({
  onClose,
  data: { id, masterPassword }
}: {
  onClose: () => void
  data: {
    id: string

    masterPassword: string
  }
}) {
  const challengeQuery = useQuery(
    forgeAPI.journal.auth.getChallenge.queryOptions({
      refetchInterval: 4 * 60 * 1000
    })
  )

  const entryQuery = useQuery(
    forgeAPI.journal.entries.getById
      .input({
        id,
        master: encrypt(masterPassword, challengeQuery.data || '')
      })
      .queryOptions({
        enabled: challengeQuery.isSuccess
      })
  )

  return (
    <>
      <ModalHeader
        icon="tabler:eye"
        title="View Journal Entry"
        onClose={onClose}
      />
      <WithQuery query={entryQuery}>
        {entry => (
          <JournalView
            cleanedUpText={entry.content}
            date={new Date(entry.date)}
            mood={entry.mood}
            photos={entry.photos.map(
              photo =>
                forgeAPI.media.input({
                  collectionId: entry.collectionId,
                  recordId: entry.id,
                  fieldId: photo,
                  token: entry.token
                }).endpoint
            )}
            rawText={entry.raw}
            summarizedText={entry.summary}
            title={entry.title}
          />
        )}
      </WithQuery>
    </>
  )
}

export default JournalViewModal
