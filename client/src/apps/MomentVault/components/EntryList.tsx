import { UseQueryResult } from '@tanstack/react-query'
import { ListResult } from 'pocketbase'
import { useCallback, useEffect } from 'react'

import {
  DeleteConfirmationModal,
  Pagination,
  QueryWrapper
} from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

import { IMomentVaultEntry } from '@apps/MomentVault/interfaces/moment_vault_interfaces'

import AudioEntry from './entries/AudioEntry'
import PhotosEntry from './entries/PhotosEntry'
import TextEntry from './entries/TextEntry'

function EntryList({
  dataQuery,
  page,
  setPage
}: {
  dataQuery: UseQueryResult<ListResult<IMomentVaultEntry>>
  page: number
  setPage: (page: number) => void
}) {
  const open = useModalStore(state => state.open)
  const handleDeleteEntry = useCallback(
    (entry: IMomentVaultEntry) => () => {
      open(DeleteConfirmationModal, {
        apiEndpoint: '/moment-vault/entries',
        data: entry,
        itemName: 'entry',
        queryKey: ['moment-vault', 'entries', page],
        queryUpdateType: 'invalidate',
        confirmationText: 'Delete this entry'
      })
    },
    [page]
  )

  useEffect(() => {
    const els = document.querySelectorAll<HTMLDivElement>('.pagination')

    els.forEach(el => {
      el.style.willChange = 'opacity, transform'
      el.getBoundingClientRect()
    })
  }, [dataQuery.data])

  return (
    <QueryWrapper query={dataQuery}>
      {data => (
        <>
          <Pagination
            className="pagination mb-6"
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
          <div className="space-y-4">
            {data.items.map(entry => {
              if (entry.type === 'audio') {
                return (
                  <AudioEntry
                    key={entry.id}
                    entriesQueryKey={['moment-vault', 'entries', page]}
                    entry={entry}
                    onDelete={handleDeleteEntry(entry)}
                  />
                )
              }

              if (entry.type === 'text') {
                return (
                  <TextEntry
                    key={entry.id}
                    entry={entry}
                    page={page}
                    onDelete={handleDeleteEntry(entry)}
                  />
                )
              }

              if (entry.type === 'photos') {
                return (
                  <PhotosEntry
                    key={entry.id}
                    entry={entry}
                    onDelete={handleDeleteEntry(entry)}
                  />
                )
              }
            })}
          </div>
          <Pagination
            className="pagination mt-6 mb-24 md:mb-6"
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </QueryWrapper>
  )
}

export default EntryList
