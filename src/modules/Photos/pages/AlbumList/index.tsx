/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/indent */
import { useDebounce } from '@uidotdev/usehooks'
import React, { useContext, useEffect, useState } from 'react'
import APIComponentWithFallback from '@components/APIComponentWithFallback'
import DeleteConfirmationModal from '@components/DeleteConfirmationModal'
import EmptyStateScreen from '@components/EmptyStateScreen'
import ModuleHeader from '@components/ModuleHeader'
import ModuleWrapper from '@components/ModuleWrapper'
import SearchInput from '@components/SearchInput'
import { type IPhotosAlbum } from '@typedec/Photos'
import AlbumItem from './components/AlbumItem'
import AlbumListHeader from './components/AlbumListHeader'
import { PhotosContext } from '../../../../providers/PhotosProvider'
import ModifyAlbumModal from '../../components/modals/ModifyAlbumModal'
import PhotosSidebar from '../../components/PhotosSidebar'

function PhotosAlbumList(): React.ReactElement {
  const { albumList, refreshAlbumList, refreshPhotos } =
    useContext(PhotosContext)
  const [selectedAlbum, setSelectedAlbum] = useState<IPhotosAlbum | null>(null)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const [filteredAlbumList, setFilteredAlbumList] = useState<
    IPhotosAlbum[] | 'loading' | 'error'
  >(albumList)

  useEffect(() => {
    if (Array.isArray(albumList)) {
      if (debouncedSearchQuery.length === 0) {
        setFilteredAlbumList(albumList)
      } else {
        setFilteredAlbumList(
          albumList.filter(album =>
            album.name
              .toLowerCase()
              .includes(debouncedSearchQuery.toLowerCase())
          )
        )
      }
    }
  }, [debouncedSearchQuery, albumList])

  return (
    <>
      <ModuleWrapper>
        <ModuleHeader
          title="Photos"
          desc="View and manage all your precious memories."
        />
        <div className="relative mt-6 flex h-full min-h-0 w-full gap-8">
          <PhotosSidebar />
          <div className="flex h-full flex-1 flex-col">
            <AlbumListHeader />
            <SearchInput
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              stuffToSearch="albums"
            />
            <APIComponentWithFallback data={albumList}>
              {typeof filteredAlbumList !== 'string' &&
                (albumList.length > 0 ? (
                  filteredAlbumList.length > 0 ? (
                    <ul className="mx-4 mt-6 grid flex-1 grid-cols-3 overflow-y-auto pb-6">
                      {filteredAlbumList.map(album => (
                        <AlbumItem
                          key={album.id}
                          album={album}
                          setDeleteModalOpen={setDeleteModalOpen}
                          setSelectedAlbum={setSelectedAlbum}
                        />
                      ))}
                    </ul>
                  ) : (
                    <EmptyStateScreen
                      description="Oops, seems like nothing matches your search."
                      title="No albums found"
                      icon="tabler:photo-off"
                    />
                  )
                ) : (
                  <EmptyStateScreen
                    description="Consider creating an album to organize your photos."
                    title="Hmm... Seems a bit empty here."
                    icon="tabler:photo-off"
                  />
                ))}
            </APIComponentWithFallback>
          </div>
        </div>
      </ModuleWrapper>
      <ModifyAlbumModal targetAlbum={selectedAlbum ?? undefined} />
      <DeleteConfirmationModal
        apiEndpoint="photos/album/delete"
        data={selectedAlbum}
        closeModal={() => {
          setDeleteModalOpen(false)
        }}
        isOpen={isDeleteModalOpen}
        itemName="album"
        updateDataList={() => {
          refreshAlbumList()
          refreshPhotos()
        }}
        nameKey="name"
        customText="Are you sure you want to delete this album? The photos inside this album will not be deleted."
      />
    </>
  )
}

export default PhotosAlbumList
