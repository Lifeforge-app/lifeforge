import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React, { useState } from 'react'
import { useSearchParams } from 'react-router'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import { usePhotosContext } from '@providers/PhotosProvider'
import TagItem from './components/TagItem'

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

  function onTagClicked(id: string) {
    const existingTags = searchParams.get('tags')?.split(',') ?? []

    if (existingTags.includes(id)) {
      existingTags.splice(existingTags.indexOf(id), 1)
    } else {
      existingTags.push(id)
    }

    setSearchParams({
      tags: existingTags.filter(e => e).join(',')
    })
  }

  return (
    <APIFallbackComponent data={albumTagList}>
      {albumTagList => (
        <>
          <div className="mt-4 flex items-start">
            <div
              className={clsx(
                'no-scrollbar flex w-full min-w-0 gap-2 transition-all',
                tagsCollapsed ? 'overflow-x-auto' : 'flex-wrap'
              )}
            >
              {albumTagList
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(tag => (
                  <TagItem
                    key={tag.id}
                    tag={tag}
                    onClick={() => onTagClicked(tag.id)}
                  />
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
