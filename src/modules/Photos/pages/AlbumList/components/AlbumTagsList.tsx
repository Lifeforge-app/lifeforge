/* eslint-disable sonarjs/no-nested-functions */
import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import { usePhotosContext } from '@providers/PhotosProvider'

function AlbumTagsList({
  setModifyAlbumTagModalOpenType
}: {
  setModifyAlbumTagModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'rename' | false>
  >
}): React.ReactElement {
  const { albumTagList } = usePhotosContext()
  const [tagsCollapsed, setTagsCollapsed] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <APIFallbackComponent data={albumTagList}>
      {albumTagList => (
        <>
          <div className="mt-4 flex items-start">
            <div
              className={`no-scrollbar flex w-full min-w-0 gap-2 transition-all ${
                tagsCollapsed ? 'overflow-x-auto' : 'flex-wrap'
              }`}
            >
              {albumTagList
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(tag => (
                  <button
                    key={tag.id}
                    className={`whitespace-nowrap rounded-full px-3 py-1 text-sm tracking-wider shadow-custom ${
                      searchParams
                        .getAll('tags')?.[0]
                        ?.split(',')
                        .includes(tag.id)
                        ? 'bg-custom-500/20 text-custom-500 hover:bg-custom-500/40'
                        : 'bg-bg-900 text-bg-500 hover:bg-bg-800'
                    }`}
                    onClick={() => {
                      const existingTags =
                        searchParams.get('tags')?.split(',') ?? []

                      if (existingTags.includes(tag.id)) {
                        existingTags.splice(existingTags.indexOf(tag.id), 1)
                      } else {
                        existingTags.push(tag.id)
                      }

                      setSearchParams({
                        tags: existingTags.filter(e => e).join(',')
                      })
                    }}
                  >
                    {tag.name} ({tag.count})
                  </button>
                ))}
              <button
                className="flex items-center rounded-full bg-bg-900 px-3 py-1 text-sm tracking-wider text-bg-500 shadow-custom transition-all hover:bg-bg-300 dark:hover:bg-bg-700/50"
                onClick={() => {
                  setModifyAlbumTagModalOpenType('create')
                }}
              >
                <Icon className="size-4" icon="tabler:plus" />
              </button>
            </div>
            <button
              className="ml-2 mt-0.5 rounded-full p-1 text-sm text-bg-500 transition-all hover:bg-bg-900"
              onClick={() => {
                setTagsCollapsed(!tagsCollapsed)
              }}
            >
              <Icon
                className="size-4"
                icon={
                  tagsCollapsed ? 'tabler:chevron-down' : 'tabler:chevron-up'
                }
              />
            </button>
          </div>
        </>
      )}
    </APIFallbackComponent>
  )
}

export default AlbumTagsList
