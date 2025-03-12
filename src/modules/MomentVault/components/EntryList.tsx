/* eslint-disable import/named */
import { ListResult } from 'pocketbase'
import React, { useEffect } from 'react'

import { APIFallbackComponent, Pagination } from '@lifeforge/ui'

import { IMomentVaultEntry } from '@modules/MomentVault/interfaces/moment_vault_interfaces'

import { Loadable } from '../../../core/interfaces/common'
import AudioEntry from './entries/AudioEntry'

function EntryList({
  data,
  page,
  setPage,
  onDelete,
  setData,
  addEntryModalOpenType
}: {
  data: Loadable<ListResult<IMomentVaultEntry>>
  page: number
  setPage: (page: number) => void
  onDelete: (data: IMomentVaultEntry) => void
  setData: React.Dispatch<
    React.SetStateAction<Loadable<ListResult<IMomentVaultEntry>>>
  >
  addEntryModalOpenType: 'text' | 'audio' | 'photo' | 'video' | null
}): React.ReactElement {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLDivElement>('.pagination')

    els.forEach(el => {
      el.style.willChange = 'opacity, transform'
      el.getBoundingClientRect()
    })
  }, [data])

  return (
    <APIFallbackComponent data={data}>
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
                entry={entry}
                setData={setData}
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
    </APIFallbackComponent>
  )
}

export default EntryList
