import React from 'react'
import { Button } from '@components/buttons'
import HamburgerMenu from '@components/buttons/HamburgerMenu'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import { SearchInput } from '@components/inputs'
import { usePhotosContext } from '@providers/PhotosProvider'
import AlbumTagsList from './AlbumTagsList'

function AlbumListHeader({
  searchQuery,
  setSearchQuery,
  setManageTagsModalOpen,
  setModifyAlbumTagModalOpenType
}: {
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  setManageTagsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setModifyAlbumTagModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'rename' | false>
  >
}): React.ReactElement {
  const { albumList, setModifyAlbumModalOpenType } = usePhotosContext()

  return (
    <>
      <header className="w-full min-w-0">
        <div className="flex-between flex">
          <h1 className="text-3xl font-semibold md:text-4xl">
            Albums{' '}
            <span className="text-bg-500 text-base">
              ({typeof albumList !== 'string' ? albumList.length : '...'})
            </span>
          </h1>
          <div className="flex items-center gap-2">
            <Button
              className="hidden sm:flex"
              icon="tabler:plus"
              onClick={() => {
                setModifyAlbumModalOpenType('create')
              }}
            >
              create
            </Button>
            <HamburgerMenu largerPadding>
              <MenuItem
                icon="tabler:tags"
                text="Manage Tags"
                onClick={() => {
                  setManageTagsModalOpen(true)
                }}
              />
            </HamburgerMenu>
          </div>
        </div>
        <SearchInput
          namespace="modules.photos"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          stuffToSearch="album"
        />
        <AlbumTagsList
          setModifyAlbumTagModalOpenType={setModifyAlbumTagModalOpenType}
        />
      </header>
    </>
  )
}

export default AlbumListHeader
