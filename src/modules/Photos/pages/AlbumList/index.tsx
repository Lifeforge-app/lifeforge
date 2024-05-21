/* eslint-disable @typescript-eslint/indent */
import { useDebounce } from '@uidotdev/usehooks'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import { type IPhotosAlbum } from '@typedec/Photos'
import AlbumItem from './components/AlbumItem'
import AlbumListHeader from './components/AlbumListHeader'
import { usePhotosContext } from '../../../../providers/PhotosProvider'
import ModifyAlbumModal from '../../components/modals/ModifyAlbumModal'
import UpdateAlbumTagsModal from '../../components/modals/UpdateAlbumTagsModal'
import PhotosSidebar from '../../components/PhotosSidebar'

function PhotosAlbumList(): React.ReactElement {
  const { albumList, refreshAlbumList, refreshPhotos } = usePhotosContext()
  const [selectedAlbum, setSelectedAlbum] = useState<IPhotosAlbum | null>(null)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [updateAlbumTagsModalOpen, setUpdateAlbumTagsModalOpen] =
    useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const [filteredAlbumList, setFilteredAlbumList] = useState<
    IPhotosAlbum[] | 'loading' | 'error'
  >(albumList)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const tags =
      searchParams
        .get('tags')
        ?.split(',')
        .filter(e => e) ?? []

    if (Array.isArray(albumList)) {
      if (debouncedSearchQuery.length === 0) {
        setFilteredAlbumList(
          albumList.filter(
            album =>
              tags.length === 0 || tags.every(tag => album.tags.includes(tag))
          )
        )
      } else {
        setFilteredAlbumList(
          albumList.filter(
            album =>
              album.name
                .toLowerCase()
                .includes(debouncedSearchQuery.toLowerCase()) &&
              (tags.length === 0 || tags.every(tag => album.tags.includes(tag)))
          )
        )
      }
    }
  }, [debouncedSearchQuery, albumList, searchParams])

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
            <AlbumListHeader
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
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
                          setUpdateAlbumTagsModalOpen={
                            setUpdateAlbumTagsModalOpen
                          }
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
        onClose={() => {
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
      <UpdateAlbumTagsModal
        isOpen={updateAlbumTagsModalOpen}
        setOpen={setUpdateAlbumTagsModalOpen}
        selectedAlbum={selectedAlbum}
      />
    </>
  )
}

export default PhotosAlbumList
