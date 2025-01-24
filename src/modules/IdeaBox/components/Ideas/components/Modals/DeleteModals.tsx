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
        isOpen={deleteIdeaConfirmationModalOpen}
        onClose={() => {
          setDeleteIdeaConfirmationModalOpen(false)
        }}
        apiEndpoint="idea-box/ideas"
        itemName="idea"
        data={existedEntry}
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
      />
      <DeleteConfirmationModal
        isOpen={deleteFolderConfirmationModalOpen}
        onClose={() => {
          setDeleteFolderConfirmationModalOpen(false)
        }}
        apiEndpoint="idea-box/folders"
        itemName="folder"
        data={existedFolder}
        updateDataLists={() => {
          setFolders(prevData =>
            typeof prevData !== 'string'
              ? prevData.filter(folder => folder.id !== existedFolder?.id)
              : prevData
          )
        }}
      />
    </>
  )
}

export default DeleteModals
