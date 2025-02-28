/* eslint-disable import/named */
import { ListResult } from 'pocketbase'
import React, { useEffect } from 'react'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import Pagination from '@components/utilities/Pagination'
import { Loadable } from '@interfaces/common'
import { IMomentVaultEntry } from '@interfaces/moment_vault_interfaces'
import AudioEntry from './entries/AudioEntry'

function EntryList({
  data,
  page,
  setPage,
  onDelete,
  setData
}: {
  data: Loadable<ListResult<IMomentVaultEntry>>
  page: number
  setPage: (page: number) => void
  onDelete: (data: IMomentVaultEntry) => void
  setData: React.Dispatch<
    React.SetStateAction<Loadable<ListResult<IMomentVaultEntry>>>
  >
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
            className="my-6 pagination"
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
          <div className="space-y-4">
            {data.items.map(entry => (
              <AudioEntry
                key={entry.id}
                entry={entry}
                setData={setData}
                onDelete={onDelete}
              />
            ))}
          </div>
          <Pagination
            className="mt-6 mb-24 md:mb-6 pagination"
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
