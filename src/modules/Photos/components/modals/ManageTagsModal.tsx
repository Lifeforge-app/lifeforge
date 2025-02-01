import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import HamburgerMenu from '@components/buttons/HamburgerMenu'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import DeleteConfirmationModal from '@components/modals/DeleteConfirmationModal'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import { type IPhotoAlbumTag } from '@interfaces/photos_interfaces'
import { usePhotosContext } from '@providers/PhotosProvider'

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
}): React.ReactElement {
  const { t } = useTranslation()
  const { albumTagList, refreshAlbumTagList } = usePhotosContext()
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false)

  return (
    <>
      <ModalWrapper isOpen={isOpen} minWidth="40rem">
        <ModalHeader
          icon="tabler:tags"
          title="Manage Tags"
          onClose={() => {
            setOpen(false)
          }}
          actionButtonIcon="tabler:plus"
          onActionButtonClick={() => {
            setModifyAlbumModalOpenType('create')
          }}
        />
        <APIFallbackComponent data={albumTagList}>
          {albumTagList =>
            albumTagList.length === 0 ? (
              <EmptyStateScreen
                namespace="modules.photos"
                name="tags"
                icon="tabler:tag-off"
                ctaContent="new"
                ctaTProps={{
                  item: t('items.tag')
                }}
                onCTAClick={() => {
                  setModifyAlbumModalOpenType('create')
                }}
              />
            ) : (
              <ul className="mb-4 flex flex-col divide-y divide-bg-200 dark:divide-bg-800">
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
                        icon="tabler:trash"
                        text="Delete"
                        onClick={() => {
                          setExistedData(tag)
                          setIsDeleteConfirmationModalOpen(true)
                        }}
                        isRed
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
        isOpen={isDeleteConfirmationModalOpen}
        data={existedData}
        itemName="tag"
        onClose={() => {
          setIsDeleteConfirmationModalOpen(false)
        }}
        updateDataLists={() => {
          refreshAlbumTagList()
        }}
        nameKey="name"
      />
    </>
  )
}

export default ManageTagsModal
