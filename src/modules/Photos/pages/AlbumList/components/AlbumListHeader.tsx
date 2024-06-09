import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Button from '@components/ButtonsAndInputs/Button'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import { usePhotosContext } from '@providers/PhotosProvider'

function AlbumListHeader({
  searchQuery,
  setSearchQuery
}: {
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
}): React.ReactElement {
  const { albumList, setModifyAlbumModalOpenType, albumTagList } =
    usePhotosContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const [tagsCollapsed, setTagsCollapsed] = useState(true)

  return (
    <header className="w-full min-w-0">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold md:text-4xl ">
          Albums{' '}
          <span className="text-base text-bg-500">
            ({typeof albumList !== 'string' ? albumList.length : '...'})
          </span>
        </h1>
        <Button
          onClick={() => {
            setModifyAlbumModalOpenType('create')
          }}
          icon="tabler:plus"
          className="hidden sm:flex"
        >
          create
        </Button>
      </div>
      <SearchInput
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        stuffToSearch="albums"
      />
      <APIComponentWithFallback data={albumTagList}>
        {typeof albumTagList !== 'string' && (
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
                    className={`whitespace-nowrap rounded-full px-3 py-1 text-sm uppercase tracking-wider shadow-custom ${
                      searchParams
                        .getAll('tags')?.[0]
                        ?.split(',')
                        .includes(tag.id)
                        ? 'bg-custom-500/20 text-custom-500 hover:bg-custom-500/40'
                        : 'bg-bg-900 text-bg-500 hover:bg-bg-800'
                    }`}
                  >
                    {tag.name} ({tag.count})
                  </button>
                ))}
              <button className="rounded-full bg-bg-900 px-3 py-1 text-sm uppercase tracking-wider text-bg-500 shadow-custom hover:bg-bg-300">
                <Icon icon="tabler:plus" className="size-4" />
              </button>
            </div>
            <button
              onClick={() => {
                setTagsCollapsed(!tagsCollapsed)
              }}
              className="ml-2 mt-0.5 rounded-full p-1 text-sm text-bg-500 transition-all hover:bg-bg-900"
            >
              <Icon
                icon={
                  tagsCollapsed ? 'tabler:chevron-down' : 'tabler:chevron-up'
                }
                className="size-4"
              />
            </button>
          </div>
        )}
      </APIComponentWithFallback>
    </header>
  )
}

export default AlbumListHeader
