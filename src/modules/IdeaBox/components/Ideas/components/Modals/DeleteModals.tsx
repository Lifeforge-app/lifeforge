import React from 'react'
import DeleteConfirmationModal from '@components/modals/DeleteConfirmationModal'
import { useIdeaBoxContext } from '@providers/IdeaBoxProvider'

function DeleteModals(): React.ReactElement {
  const {
    deleteIdeaConfirmationModalOpen,
    setDeleteIdeaConfirmationModalOpen,
    deleteFolderConfirmationModalOpen,
    setDeleteFolderConfirmationModalOpen,
    existedEntry,
    existedFolder,
    setEntries,
    setSearchResults,
    setFolders,
    refreshTags
  } = useIdeaBoxContext()

  return (
    <>
      <DeleteConfirmationModal
        apiEndpoint="idea-box/ideas"
        data={existedEntry}
        isOpen={deleteIdeaConfirmationModalOpen}
        itemName="idea"
        updateDataLists={() => {
          setEntries(prevData =>
            typeof prevData !== 'string'
              ? prevData.filter(entry => entry.id !== existedEntry?.id)
              : prevData
          )
          setSearchResults(prevData =>
            typeof prevData !== 'string'
              ? prevData.filter(entry => entry.id !== existedEntry?.id)
              : prevData
          )
          refreshTags()
        }}
        onClose={() => {
          setDeleteIdeaConfirmationModalOpen(false)
        }}
      />
      <DeleteConfirmationModal
        apiEndpoint="idea-box/folders"
        data={existedFolder}
        isOpen={deleteFolderConfirmationModalOpen}
        itemName="folder"
        updateDataLists={() => {
          setFolders(prevData =>
            typeof prevData !== 'string'
              ? prevData.filter(folder => folder.id !== existedFolder?.id)
              : prevData
          )
        }}
        onClose={() => {
          setDeleteFolderConfirmationModalOpen(false)
        }}
      />
    </>
  )
}

export default DeleteModals
