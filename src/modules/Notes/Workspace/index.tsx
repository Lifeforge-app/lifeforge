import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import GoBackButton from '@components/ButtonsAndInputs/GoBackButton'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleHeader from '@components/Module/ModuleHeader'
import useFetch from '@hooks/useFetch'
import { type INotesSubject, type INotesWorkspace } from '@typedec/Notes'
import CreateSubjectButton from './components/CreateSubjectButton'
import ModifySubjectModal from './components/ModifySubjectModal'
import SubjectItem from './components/SubjectItem'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'

function NotesCategory(): React.ReactElement {
  const { workspace } = useParams<{ workspace: string }>()
  const [valid] = useFetch<boolean>(`notes/workspace/valid/${workspace}`)
  const [titleData] = useFetch<INotesWorkspace>(
    `notes/workspace/get/${workspace}`
  )
  const [subjectsData, refreshSubjectData] = useFetch<INotesSubject[]>(
    `notes/subject/list/${workspace}`
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
      navigate('/notes')
    }
  }, [valid])

  return (
    <APIComponentWithFallback data={valid}>
      <section className="flex h-full min-h-0 w-full flex-1 flex-col overflow-y-scroll px-8 md:px-12">
        <GoBackButton
          onClick={() => {
            navigate('/notes')
          }}
        />
        <ModuleHeader
          title={
            <>
              Notes -{' '}
              {titleData === 'loading' ? (
                <Icon icon="svg-spinners:180-ring" className="size-8" />
              ) : titleData === 'error' ? (
                <span className="flex items-center gap-2 text-red-500">
                  <Icon
                    icon="tabler:alert-triangle"
                    className="mt-1 size-8 stroke-red-500 stroke-[2px]"
                  />
                  Failed to fetch data
                </span>
              ) : (
                titleData.name
              )}
            </>
          }
          desc="A place to store all your involuntarily generated thoughts."
        />
        <APIComponentWithFallback data={subjectsData}>
          {typeof subjectsData !== 'string' &&
            (subjectsData.length > 0 ? (
              <div className="flex-center grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-4 py-8">
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
                  setModifySubjectModalOpenType={setModifySubjectModalOpenType}
                  setExistedData={setExistedData}
                />
              </div>
            ) : (
              <EmptyStateScreen
                title="A bit empty here. "
                description="Create a new subject to start storing your notes."
                icon="tabler:folder-off"
                ctaContent="Create subject"
                setModifyModalOpenType={setModifySubjectModalOpenType}
              />
            ))}
        </APIComponentWithFallback>
        <DeleteConfirmationModal
          isOpen={deleteSubjectConfirmationModalOpen}
          onClose={() => {
            setDeleteSubjectConfirmationModalOpen(false)
          }}
          apiEndpoint="notes/subject/delete"
          itemName="subject"
          data={existedData}
          updateDataList={refreshSubjectData}
          nameKey="title"
        />
        <ModifySubjectModal
          openType={modifySubjectModalOpenType}
          setOpenType={setModifySubjectModalOpenType}
          existedData={existedData}
          updateSubjectList={refreshSubjectData}
        />
      </section>
    </APIComponentWithFallback>
  )
}

export default NotesCategory
