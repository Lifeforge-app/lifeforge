/* eslint-disable sonarjs/no-nested-conditional */
import { Icon } from '@iconify/react'
import { useDebounce } from '@uidotdev/usehooks'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import DeleteConfirmationModal from '@components/modals/DeleteConfirmationModal'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import Scrollbar from '@components/utilities/Scrollbar'
import { type Loadable } from '@interfaces/common'
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
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 300)
  const [filteredAlbumList, setFilteredAlbumList] =
    useState<Loadable<IPhotosAlbum[]>>(albumList)
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
          actionButton={
            <button
              className="rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200 dark:hover:bg-bg-800 dark:hover:text-bg-50 lg:hidden"
              onClick={() => {
                setSidebarOpen(true)
              }}
            >
              <Icon className="text-2xl" icon="tabler:menu" />
            </button>
          }
          title="Photos"
        />
        <div className="mt-6 flex size-full min-h-0 gap-8">
          <PhotosSidebar />
          <Scrollbar>
            <div className="flex size-full min-w-0 flex-1 flex-col pb-8">
              <AlbumListHeader
                searchQuery={searchQuery}
                setManageTagsModalOpen={setManageTagsModalOpen}
                setModifyAlbumTagModalOpenType={setModifyAlbumTagModalOpenType}
                setSearchQuery={setSearchQuery}
              />
              <APIFallbackComponent data={filteredAlbumList}>
                {filteredAlbumList =>
                  albumList.length > 0 ? (
                    filteredAlbumList.length > 0 ? (
                      <ul className="mt-6 grid w-full min-w-0 flex-1 gap-2 overflow-y-auto pb-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredAlbumList.map(album => (
                          <AlbumItem
                            key={album.id}
                            album={album}
                            setDeleteModalOpen={setDeleteModalOpen}
                            setSelectedAlbum={setSelectedAlbum}
                            setUpdateAlbumTagsModalOpen={
                              setUpdateAlbumTagsModalOpen
                            }
                          />
                        ))}
                      </ul>
                    ) : (
                      <EmptyStateScreen
                        icon="tabler:photo-off"
                        name="albumResults"
                        namespace="modules.photos"
                      />
                    )
                  ) : (
                    <EmptyStateScreen
                      icon="tabler:photo-off"
                      name="albums"
                      namespace="modules.photos"
                    />
                  )
                }
              </APIFallbackComponent>
            </div>
          </Scrollbar>
        </div>
      </ModuleWrapper>
      <ModifyAlbumModal targetAlbum={selectedAlbum ?? undefined} />
      <DeleteConfirmationModal
        apiEndpoint="photos/album/delete"
        customText="Are you sure you want to delete this album? The photos inside this album will not be deleted."
        data={selectedAlbum}
        isOpen={isDeleteModalOpen}
        itemName="album"
        nameKey="name"
        updateDataLists={() => {
          refreshAlbumList()
          refreshPhotos()
        }}
        onClose={() => {
          setDeleteModalOpen(false)
        }}
      />
      <ManageTagsModal
        existedData={existedTagData}
        isOpen={manageTagsModalOpen}
        setExistedData={setExistedTagData}
        setModifyAlbumModalOpenType={setModifyAlbumTagModalOpenType}
        setOpen={setManageTagsModalOpen}
      />
      <ModifyAlbumTagsModal
        openType={modifyAlbumTagModalOpenType}
        setOpenType={setModifyAlbumTagModalOpenType}
        targetTag={existedTagData ?? undefined}
      />
      <UpdateAlbumTagsModal
        isOpen={updateAlbumTagsModalOpen}
        selectedAlbum={selectedAlbum}
        setOpen={setUpdateAlbumTagsModalOpen}
      />
    </>
  )
}

export default PhotosAlbumList
