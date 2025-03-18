/* eslint-disable import/named */
import { UseQueryResult } from '@tanstack/react-query'
import { ListResult } from 'pocketbase'
import { useEffect } from 'react'

import { Pagination, QueryWrapper } from '@lifeforge/ui'

import { IMomentVaultEntry } from '@apps/MomentVault/interfaces/moment_vault_interfaces'

import AudioEntry from './entries/AudioEntry'

function EntryList({
  dataQuery,
  page,
  setPage,
  onDelete,
  addEntryModalOpenType
}: {
  dataQuery: UseQueryResult<ListResult<IMomentVaultEntry>>
  page: number
  setPage: (page: number) => void
  onDelete: (data: IMomentVaultEntry) => void
  addEntryModalOpenType: 'text' | 'audio' | 'photo' | 'video' | null
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
            {data.items.map(entry => (
              <AudioEntry
                key={entry.id}
                addEntryModalOpenType={addEntryModalOpenType}
                entriesQueryKey={['moment-vault', 'entries', page]}
                entry={entry}
                onDelete={onDelete}
              />
            ))}
          </div>
          <Pagination
            className="pagination mb-24 mt-6 md:mb-6"
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
