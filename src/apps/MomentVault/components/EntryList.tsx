import { UseQueryResult } from '@tanstack/react-query'
import { ListResult } from 'pocketbase'
import { useEffect } from 'react'

import { Pagination, QueryWrapper } from '@lifeforge/ui'

import { IMomentVaultEntry } from '@apps/MomentVault/interfaces/moment_vault_interfaces'

import AudioEntry from './entries/AudioEntry'
import PhotosEntry from './entries/PhotosEntry'
import TextEntry from './entries/TextEntry'

function EntryList({
  dataQuery,
  page,
  setPage,
  onDelete,
  addEntryModalOpenType,
  onTextEntryEdit
}: {
  dataQuery: UseQueryResult<ListResult<IMomentVaultEntry>>
  page: number
  setPage: (page: number) => void
  onDelete: (data: IMomentVaultEntry) => void
  addEntryModalOpenType: 'text' | 'audio' | 'photos' | 'video' | null
  onTextEntryEdit: (data: IMomentVaultEntry) => void
}) {
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
            className="pagination my-6"
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
                    addEntryModalOpenType={addEntryModalOpenType}
                    entriesQueryKey={['moment-vault', 'entries', page]}
                    entry={entry}
                    onDelete={() => onDelete(entry)}
                  />
                )
              }

              if (entry.type === 'text') {
                return (
                  <TextEntry
                    key={entry.id}
                    entry={entry}
                    onDelete={() => onDelete(entry)}
                    onEdit={() => onTextEntryEdit(entry)}
                  />
                )
              }

              if (entry.type === 'photos') {
                return (
                  <PhotosEntry
                    key={entry.id}
                    entry={entry}
                    onDelete={() => onDelete(entry)}
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
