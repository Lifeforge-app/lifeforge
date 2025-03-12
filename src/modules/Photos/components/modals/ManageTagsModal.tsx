import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  APIFallbackComponent,
  DeleteConfirmationModal,
  EmptyStateScreen,
  HamburgerMenu,
  MenuItem,
  ModalHeader,
  ModalWrapper
} from '@lifeforge/ui'

import { usePhotosContext } from '@modules/Photos/providers/PhotosProvider'

import { type IPhotoAlbumTag } from '../../interfaces/photos_interfaces'

function ManageTagsModal({
  isOpen,
  setOpen,
  setModifyAlbumModalOpenType,
  existedData,
  setExistedData
}: {
  isOpen: boolean
  setOpen: (value: boolean) => void
  setModifyAlbumModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'rename' | false>
  >
  existedData: IPhotoAlbumTag | null
  setExistedData: React.Dispatch<React.SetStateAction<IPhotoAlbumTag | null>>
}) {
  const { t } = useTranslation('modules.photos')
  const { albumTagList, refreshAlbumTagList } = usePhotosContext()
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false)

  return (
    <>
      <ModalWrapper isOpen={isOpen} minWidth="40rem">
        <ModalHeader
          actionButtonIcon="tabler:plus"
          icon="tabler:tags"
          title="Manage Tags"
          onActionButtonClick={() => {
            setModifyAlbumModalOpenType('create')
          }}
          onClose={() => {
            setOpen(false)
          }}
        />
        <APIFallbackComponent data={albumTagList}>
          {albumTagList =>
            albumTagList.length === 0 ? (
              <EmptyStateScreen
                ctaContent="new"
                ctaTProps={{
                  item: t('items.tag')
                }}
                icon="tabler:tag-off"
                name="tags"
                namespace="modules.photos"
                onCTAClick={() => {
                  setModifyAlbumModalOpenType('create')
                }}
              />
            ) : (
              <ul className="divide-bg-200 dark:divide-bg-800 mb-4 flex flex-col divide-y">
                {albumTagList.map(tag => (
                  <li
                    key={tag.id}
                    className="flex-between flex gap-4 px-2 py-4"
                  >
                    <div className="flex items-center gap-4">
                      {tag.name} ({tag.count})
                    </div>
                    <HamburgerMenu className="relative">
                      <MenuItem
                        icon="tabler:pencil"
                        text="Edit"
                        onClick={() => {
                          setExistedData(tag)
                          setModifyAlbumModalOpenType('rename')
                        }}
                      />
                      <MenuItem
                        isRed
                        icon="tabler:trash"
                        text="Delete"
                        onClick={() => {
                          setExistedData(tag)
                          setIsDeleteConfirmationModalOpen(true)
                        }}
                      />
                    </HamburgerMenu>
                  </li>
                ))}
              </ul>
            )
          }
        </APIFallbackComponent>
      </ModalWrapper>
      <DeleteConfirmationModal
        apiEndpoint="photos/album/tag"
        data={existedData}
        isOpen={isDeleteConfirmationModalOpen}
        itemName="tag"
        nameKey="name"
        updateDataList={() => {
          refreshAlbumTagList()
        }}
        onClose={() => {
          setIsDeleteConfirmationModalOpen(false)
        }}
      />
    </>
  )
}

export default ManageTagsModal
