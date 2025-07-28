import { type UseQueryResult, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import type { InferOutput } from 'lifeforge-api'
import { ConfirmationModal, Pagination, QueryWrapper } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'

import AudioEntry from './entries/AudioEntry'
import PhotosEntry from './entries/PhotosEntry'
import TextEntry from './entries/TextEntry'

function EntryList({
  dataQuery,
  page,
  setPage
}: {
  dataQuery: UseQueryResult<
    InferOutput<typeof forgeAPI.momentVault.entries.list>
  >
  page: number
  setPage: (page: number) => void
}) {
  const queryClient = useQueryClient()

  const open = useModalStore(state => state.open)

  const handleDeleteEntry = useCallback(
    (entryId: string) => () => {
      open(ConfirmationModal, {
        title: 'Delete Entry',
        description: 'Are you sure you want to delete this entry?',
        buttonType: 'delete',
        onConfirm: async () => {
          try {
            await forgeAPI.momentVault.entries.remove
              .input({
                id: entryId
              })
              .mutate({})

            await queryClient.invalidateQueries({
              queryKey: ['momentVault', 'entries']
            })
          } catch (error: any) {
            toast.error(`Failed to delete entry: ${error.message}`)
          }
        }
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
                    currentPage={page}
                    entry={entry}
                    onDelete={handleDeleteEntry(entry.id)}
                  />
                )
              }

              if (entry.type === 'text') {
                return (
                  <TextEntry
                    key={entry.id}
                    entry={entry}
                    onDelete={handleDeleteEntry(entry.id)}
                  />
                )
              }

              if (entry.type === 'photos') {
                return (
                  <PhotosEntry
                    key={entry.id}
                    entry={entry}
                    onDelete={handleDeleteEntry(entry.id)}
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
