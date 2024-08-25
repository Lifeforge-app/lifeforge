import React from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
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
          <h1 className="text-3xl font-semibold md:text-4xl ">
            Albums{' '}
            <span className="text-base text-bg-500">
              ({typeof albumList !== 'string' ? albumList.length : '...'})
            </span>
          </h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                setModifyAlbumModalOpenType('create')
              }}
              icon="tabler:plus"
              className="hidden sm:flex"
            >
              create
            </Button>
            <HamburgerMenu largerPadding>
              <MenuItem
                text="Manage Tags"
                icon="tabler:tags"
                onClick={() => {
                  setManageTagsModalOpen(true)
                }}
              />
            </HamburgerMenu>
          </div>
        </div>
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          stuffToSearch="albums"
        />
        <AlbumTagsList
          setModifyAlbumTagModalOpenType={setModifyAlbumTagModalOpenType}
        />
      </header>
    </>
  )
}

export default AlbumListHeader
