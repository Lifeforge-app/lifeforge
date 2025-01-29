import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import DeleteConfirmationModal from '@components/modals/DeleteConfirmationModal'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import useFetch from '@hooks/useFetch'
import { type INotesEntry } from '@interfaces/notes_interfaces'
import Directory from './components/Directory'
import DirectoryHeader from './components/Directory/components/DirectoryHeader'
import ModifyFolderModal from './components/ModifyFolderModal'

function NotesSubject(): React.ReactElement {
  const {
    subject,
    '*': path,
    workspace
  } = useParams<{ subject: string; '*': string; workspace: string }>()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [valid] = useFetch<boolean>(
    `notes/entries/valid/${workspace}/${subject}/${path}`
  )
  const [notesEntries, refreshNotesEntries] = useFetch<INotesEntry[]>(
    `notes/entries/list/${subject}/${path}`,
    valid === true
  )
  const [modifyFolderModalOpenType, setModifyFolderModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [
    deleteFolderConfirmationModalOpen,
    setDeleteFolderConfirmationModalOpen
  ] = useState(false)
  const [existedData, setExistedData] = useState<INotesEntry | null>(null)

  useEffect(() => {
    if (typeof valid === 'boolean' && !valid) {
      toast.error('Invalid path')
      navigate('/notes')
    }
  }, [valid])

  return (
    <APIFallbackComponent data={valid}>
      {() => (
        <>
          <ModuleWrapper className="mb-28 flex size-full min-h-0 flex-1 flex-col px-8 md:px-12">
            <DirectoryHeader
              updateNotesEntries={refreshNotesEntries}
              setModifyFolderModalOpenType={setModifyFolderModalOpenType}
              setExistedData={setExistedData}
            />
            <APIFallbackComponent data={notesEntries}>
              {notesEntries =>
                notesEntries.length > 0 ? (
                  <Directory
                    notesEntries={notesEntries}
                    setDeleteFolderConfirmationModalOpen={
                      setDeleteFolderConfirmationModalOpen
                    }
                    setModifyFolderModalOpenType={setModifyFolderModalOpenType}
                    setExistedData={setExistedData}
                  />
                ) : (
                  <EmptyStateScreen
                    ctaContent="upload"
                    icon="tabler:file-off"
                    title={t('emptyState.notes.title')}
                    description={t('emptyState.notes.description')}
                  />
                )
              }
            </APIFallbackComponent>
            <ModifyFolderModal
              openType={modifyFolderModalOpenType}
              setOpenType={setModifyFolderModalOpenType}
              existedData={existedData}
              updateNotesEntries={refreshNotesEntries}
            />
            <DeleteConfirmationModal
              isOpen={deleteFolderConfirmationModalOpen}
              onClose={() => {
                setExistedData(null)
                setDeleteFolderConfirmationModalOpen(false)
              }}
              apiEndpoint="notes/entries/delete"
              itemName="folder"
              data={existedData}
              updateDataLists={refreshNotesEntries}
            />
          </ModuleWrapper>
        </>
      )}
    </APIFallbackComponent>
  )
}

export default NotesSubject
