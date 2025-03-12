import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify'

import {
  APIFallbackComponent,
  DeleteConfirmationModal,
  EmptyStateScreen,
  GoBackButton
, ModuleWrapper , ModuleHeader } from '@lifeforge/ui'

import useFetch from '@hooks/useFetch'

import {
  type INotesSubject,
  type INotesWorkspace
} from '../interfaces/notes_interfaces'
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
                            className="mt-1 size-8 stroke-red-500 stroke-[2px]"
                            icon="tabler:alert-triangle"
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
                      setDeleteSubjectConfirmationModalOpen={
                        setDeleteSubjectConfirmationModalOpen
                      }
                      setExistedData={setExistedData}
                      setModifySubjectModalOpenType={
                        setModifySubjectModalOpenType
                      }
                      subject={subject}
                    />
                  ))}
                  <CreateSubjectButton
                    setExistedData={setExistedData}
                    setModifySubjectModalOpenType={
                      setModifySubjectModalOpenType
                    }
                  />
                </div>
              ) : (
                <EmptyStateScreen
                  ctaContent="new"
                  ctaTProps={{
                    item: t('items.subject')
                  }}
                  icon="tabler:folder-off"
                  name="subject"
                  namespace="modules.notes"
                  onCTAClick={setModifySubjectModalOpenType}
                />
              )
            }
          </APIFallbackComponent>
          <DeleteConfirmationModal
            apiEndpoint="notes/subject"
            data={existedData}
            isOpen={deleteSubjectConfirmationModalOpen}
            itemName="subject"
            nameKey="title"
            updateDataList={refreshSubjectData}
            onClose={() => {
              setDeleteSubjectConfirmationModalOpen(false)
            }}
          />
          <ModifySubjectModal
            existedData={existedData}
            openType={modifySubjectModalOpenType}
            setOpenType={setModifySubjectModalOpenType}
            updateSubjectList={refreshSubjectData}
          />
        </ModuleWrapper>
      )}
    </APIFallbackComponent>
  )
}

export default NotesCategory
