import { Icon } from '@iconify/react'
import { useDebounce } from '@uidotdev/usehooks'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import Scrollbar from '@components/Scrollbar'
import {
  type IPhotoAlbumTag,
  type IPhotosAlbum
} from '@interfaces/photos_interfaces'
import AlbumItem from './components/AlbumItem'
import AlbumListHeader from './components/AlbumListHeader'
import { usePhotosContext } from '../../../../providers/PhotosProvider'
import ManageTagsModal from '../../components/modals/ManageTagsModal'
import ModifyAlbumModal from '../../components/modals/ModifyAlbumModal'
import ModifyAlbumTagsModal from '../../components/modals/ModifyAlbumTagsModal'
import UpdateAlbumTagsModal from '../../components/modals/UpdateAlbumTagsModal'
import PhotosSidebar from '../../components/PhotosSidebar'

function PhotosAlbumList(): React.ReactElement {
  const { albumList, refreshAlbumList, refreshPhotos, setSidebarOpen } =
    usePhotosContext()
  const [selectedAlbum, setSelectedAlbum] = useState<IPhotosAlbum | null>(null)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [manageTagsModalOpen, setManageTagsModalOpen] = useState(false)
  const [modifyAlbumTagModalOpenType, setModifyAlbumTagModalOpenType] =
    useState<'create' | 'rename' | false>(false)
  const [updateAlbumTagsModalOpen, setUpdateAlbumTagsModalOpen] =
    useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const [filteredAlbumList, setFilteredAlbumList] = useState<
    IPhotosAlbum[] | 'loading' | 'error'
  >(albumList)
  const [searchParams] = useSearchParams()
  const [existedTagData, setExistedTagData] = useState<IPhotoAlbumTag | null>(
    null
  )

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
          actionButton={
            <button
              onClick={() => {
                setSidebarOpen(true)
              }}
              className="rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200 dark:hover:bg-bg-800 dark:hover:text-bg-100 lg:hidden"
            >
              <Icon icon="tabler:menu" className="text-2xl" />
            </button>
          }
        />
        <div className="mt-6 flex size-full min-h-0 gap-8">
          <PhotosSidebar />
          <Scrollbar>
            <div className="flex size-full min-w-0 flex-1 flex-col pb-8">
              <AlbumListHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setManageTagsModalOpen={setManageTagsModalOpen}
                setModifyAlbumTagModalOpenType={setModifyAlbumTagModalOpenType}
              />
              <APIComponentWithFallback data={filteredAlbumList}>
                {filteredAlbumList =>
                  albumList.length > 0 ? (
                    filteredAlbumList.length > 0 ? (
                      <ul className="mt-6 grid w-full min-w-0 flex-1 gap-2 overflow-y-auto pb-6 sm:grid-cols-2 lg:grid-cols-3">
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
                  )
                }
              </APIComponentWithFallback>
            </div>
          </Scrollbar>
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
      <ManageTagsModal
        isOpen={manageTagsModalOpen}
        setOpen={setManageTagsModalOpen}
        existedData={existedTagData}
        setExistedData={setExistedTagData}
        setModifyAlbumModalOpenType={setModifyAlbumTagModalOpenType}
      />
      <ModifyAlbumTagsModal
        openType={modifyAlbumTagModalOpenType}
        setOpenType={setModifyAlbumTagModalOpenType}
        targetTag={existedTagData ?? undefined}
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
