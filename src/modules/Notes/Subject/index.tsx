import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify'

import {
  APIFallbackComponent,
  DeleteConfirmationModal,
  EmptyStateScreen,
  ModuleWrapper
} from '@lifeforge/ui'

import useFetch from '@hooks/useFetch'

import { type INotesEntry } from '../interfaces/notes_interfaces'
import Directory from './components/Directory'
import DirectoryHeader from './components/Directory/components/DirectoryHeader'
import ModifyFolderModal from './components/ModifyFolderModal'

function NotesSubject() {
  const {
    subject,
    '*': path,
    workspace
  } = useParams<{ subject: string; '*': string; workspace: string }>()
  const { t } = useTranslation('modules.notes')
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
              setExistedData={setExistedData}
              setModifyFolderModalOpenType={setModifyFolderModalOpenType}
              updateNotesEntries={refreshNotesEntries}
            />
            <APIFallbackComponent data={notesEntries}>
              {notesEntries =>
                notesEntries.length > 0 ? (
                  <Directory
                    notesEntries={notesEntries}
                    setDeleteFolderConfirmationModalOpen={
                      setDeleteFolderConfirmationModalOpen
                    }
                    setExistedData={setExistedData}
                    setModifyFolderModalOpenType={setModifyFolderModalOpenType}
                  />
                ) : (
                  <EmptyStateScreen
                    ctaContent="upload"
                    description={t('emptyState.notes.description')}
                    icon="tabler:file-off"
                    name="note"
                    namespace="modules.notes"
                    title={t('emptyState.notes.title')}
                  />
                )
              }
            </APIFallbackComponent>
            <ModifyFolderModal
              existedData={existedData}
              openType={modifyFolderModalOpenType}
              setOpenType={setModifyFolderModalOpenType}
              updateNotesEntries={refreshNotesEntries}
            />
            <DeleteConfirmationModal
              apiEndpoint="notes/entries/delete"
              data={existedData}
              isOpen={deleteFolderConfirmationModalOpen}
              itemName="folder"
              updateDataList={refreshNotesEntries}
              onClose={() => {
                setExistedData(null)
                setDeleteFolderConfirmationModalOpen(false)
              }}
            />
          </ModuleWrapper>
        </>
      )}
    </APIFallbackComponent>
  )
}

export default NotesSubject
