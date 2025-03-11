import { useIdeaBoxContext } from '@providers/IdeaBoxProvider'
import React from 'react'
import { useParams } from 'react-router'

import { DeleteConfirmationModal } from '@lifeforge/ui'

function DeleteModals(): React.ReactElement {
  const { id, '*': path } = useParams<{ id: string; '*': string }>()
  const {
    deleteIdeaConfirmationModalOpen,
    setDeleteIdeaConfirmationModalOpen,
    deleteFolderConfirmationModalOpen,
    setDeleteFolderConfirmationModalOpen,
    existedEntry,
    existedFolder,
    viewArchived,
    selectedTags,
    debouncedSearchQuery
  } = useIdeaBoxContext()

  return (
    <>
      <DeleteConfirmationModal
        multiQueryKey
        apiEndpoint="idea-box/ideas"
        data={existedEntry}
        isOpen={deleteIdeaConfirmationModalOpen}
        itemName="idea"
        queryKey={[
          ['idea-box', 'search', id, path, selectedTags, debouncedSearchQuery],
          ['idea-box', 'ideas', id!, path!, viewArchived]
        ]}
        onClose={() => {
          setDeleteIdeaConfirmationModalOpen(false)
        }}
      />
      <DeleteConfirmationModal
        apiEndpoint="idea-box/folders"
        data={existedFolder}
        isOpen={deleteFolderConfirmationModalOpen}
        itemName="folder"
        queryKey={['idea-box', 'folders', id!, path!]}
        onClose={() => {
          setDeleteFolderConfirmationModalOpen(false)
        }}
      />
    </>
  )
}

export default DeleteModals
