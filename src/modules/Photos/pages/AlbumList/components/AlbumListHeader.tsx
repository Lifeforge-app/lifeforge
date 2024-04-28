import { Icon } from '@iconify/react'
import React, { useContext } from 'react'
import { useSearchParams } from 'react-router-dom'
import APIComponentWithFallback from '@components/APIComponentWithFallback'
import SearchInput from '@components/SearchInput'
import { PhotosContext } from '@providers/PhotosProvider'

function AlbumListHeader({
  searchQuery,
  setSearchQuery
}: {
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
}): React.ReactElement {
  const { albumList, setModifyAlbumModalOpenType, albumTagList } =
    useContext(PhotosContext)
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <header>
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-semibold text-bg-800 dark:text-bg-100">
          Albums{' '}
          <span className="text-base text-bg-500">
            ({typeof albumList !== 'string' ? albumList.length : '...'})
          </span>
        </h1>
        <button
          onClick={() => {
            setModifyAlbumModalOpenType('create')
          }}
          className="flex shrink-0 items-center gap-2 rounded-lg bg-custom-500 p-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)]   hover:bg-custom-600 dark:text-bg-800"
        >
          <Icon icon="tabler:plus" className="h-5 w-5 shrink-0" />
          <span className="shrink-0">create</span>
        </button>
      </div>
      <SearchInput
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        stuffToSearch="albums"
      />
      <APIComponentWithFallback data={albumTagList}>
        {typeof albumTagList !== 'string' && (
          <div className="mt-4 flex flex-wrap gap-2">
            {albumTagList.map(tag => (
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
                className={`rounded-full px-3 py-1 text-sm uppercase tracking-wider shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] ${
                  searchParams.getAll('tags')?.[0]?.split(',').includes(tag.id)
                    ? 'bg-custom-500/20 text-custom-500 hover:bg-custom-500/40'
                    : 'bg-bg-900 text-bg-500 hover:bg-bg-800'
                }`}
              >
                {tag.name} ({tag.count})
              </button>
            ))}
            <button className="rounded-full bg-bg-900 px-3 py-1 text-sm uppercase tracking-wider text-bg-500 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] hover:bg-bg-300">
              <Icon icon="tabler:plus" className="h-4 w-4" />
            </button>
          </div>
        )}
      </APIComponentWithFallback>
    </header>
  )
}

export default AlbumListHeader
