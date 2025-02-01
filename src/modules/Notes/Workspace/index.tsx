import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify'
import { GoBackButton } from '@components/buttons'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import DeleteConfirmationModal from '@components/modals/DeleteConfirmationModal'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import useFetch from '@hooks/useFetch'
import {
  type INotesSubject,
  type INotesWorkspace
} from '@interfaces/notes_interfaces'
import CreateSubjectButton from './components/CreateSubjectButton'
import ModifySubjectModal from './components/ModifySubjectModal'
import SubjectItem from './components/SubjectItem'

function NotesCategory(): React.ReactElement {
  const { t } = useTranslation('modules.notes')
  const { workspace } = useParams<{ workspace: string }>()
  const [valid] = useFetch<boolean>(`notes/workspace/valid/${workspace}`)
  const [titleData] = useFetch<INotesWorkspace>(
    `notes/workspace/get/${workspace}`,
    valid === true
  )
  const [subjectsData, refreshSubjectData] = useFetch<INotesSubject[]>(
    `notes/subject/${workspace}`,
    valid === true
  )
  const [modifySubjectModalOpenType, setModifySubjectModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [
    deleteSubjectConfirmationModalOpen,
    setDeleteSubjectConfirmationModalOpen
  ] = useState(false)
  const [existedData, setExistedData] = useState<INotesSubject | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (typeof valid === 'boolean' && !valid) {
      toast.error('Invalid workspace')
      navigate('/notes')
    }
  }, [valid])

  return (
    <APIFallbackComponent data={valid}>
      {() => (
        <ModuleWrapper>
          <GoBackButton
            onClick={() => {
              navigate('/notes')
            }}
          />
          <ModuleHeader
            icon={typeof titleData === 'string' ? '' : titleData.icon}
            title={
              <>
                Notes -{' '}
                {(() => {
                  switch (titleData) {
                    case 'loading':
                      return <span className="loader"></span>
                    case 'error':
                      return (
                        <span className="flex items-center gap-2 text-red-500">
                          <Icon
                            icon="tabler:alert-triangle"
                            className="mt-1 size-8 stroke-red-500 stroke-[2px]"
                          />
                          Failed to fetch data
                        </span>
                      )
                    default:
                      return titleData.name
                  }
                })()}
              </>
            }
          />
          <APIFallbackComponent data={subjectsData}>
            {subjectsData =>
              subjectsData.length > 0 ? (
                <div className="mb-8 grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-4 py-8">
                  {subjectsData.map(subject => (
                    <SubjectItem
                      key={subject.id}
                      subject={subject}
                      setModifySubjectModalOpenType={
                        setModifySubjectModalOpenType
                      }
                      setDeleteSubjectConfirmationModalOpen={
                        setDeleteSubjectConfirmationModalOpen
                      }
                      setExistedData={setExistedData}
                    />
                  ))}
                  <CreateSubjectButton
                    setModifySubjectModalOpenType={
                      setModifySubjectModalOpenType
                    }
                    setExistedData={setExistedData}
                  />
                </div>
              ) : (
                <EmptyStateScreen
                  icon="tabler:folder-off"
                  namespace="modules.notes"
                  name="subject"
                  ctaContent="new"
                  ctaTProps={{
                    item: t('items.subject')
                  }}
                  onCTAClick={setModifySubjectModalOpenType}
                />
              )
            }
          </APIFallbackComponent>
          <DeleteConfirmationModal
            isOpen={deleteSubjectConfirmationModalOpen}
            onClose={() => {
              setDeleteSubjectConfirmationModalOpen(false)
            }}
            apiEndpoint="notes/subject"
            itemName="subject"
            data={existedData}
            updateDataLists={refreshSubjectData}
            nameKey="title"
          />
          <ModifySubjectModal
            openType={modifySubjectModalOpenType}
            setOpenType={setModifySubjectModalOpenType}
            existedData={existedData}
            updateSubjectList={refreshSubjectData}
          />
        </ModuleWrapper>
      )}
    </APIFallbackComponent>
  )
}

export default NotesCategory
