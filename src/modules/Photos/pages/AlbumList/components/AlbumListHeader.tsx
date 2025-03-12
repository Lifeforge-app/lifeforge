import { Button, HamburgerMenu, MenuItem, SearchInput } from '@lifeforge/ui'

import { usePhotosContext } from '@modules/Photos/providers/PhotosProvider'

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
}) {
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
            <HamburgerMenu>
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
