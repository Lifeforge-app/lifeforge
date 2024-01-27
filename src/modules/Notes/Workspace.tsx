/* eslint-disable @typescript-eslint/indent */
/* eslint-disable multiline-ternary */
import React, { useEffect, useState } from 'react'
import ModuleHeader from '../../components/ModuleHeader'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useParams } from 'react-router'
import { type INotesWorkspace } from '.'
import { toast } from 'react-toastify'
import Error from '../../components/Error'
import Loading from '../../components/Loading'
import EmptyStateScreen from '../../components/EmptyStateScreen'
import ModifySubjectModal from './ModifySubjectModal'
import { Link } from 'react-router-dom'
import { Menu, Transition } from '@headlessui/react'
import DeleteSubjectConfirmationModal from './DeleteSubjectrConfirmationModal.1'

export interface INotesSubject {
  workspace: string
  collectionId: string
  collectionName: string
  created: string
  description: string
  icon: string
  id: string
  title: string
  updated: string
}

function NotesCategory(): React.ReactElement {
  const { workspace } = useParams<{ workspace: string }>()
  const [titleData, setTitleData] = useState<
    INotesWorkspace | 'error' | 'loading'
  >('loading')
  const [subjectsData, setSubjectsData] = useState<
    INotesSubject[] | 'error' | 'loading'
  >('loading')
  const [modifySubjectModalOpenType, setModifySubjectModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [
    deleteSubjectConfirmationModalOpen,
    setDeleteSubjectConfirmationModalOpen
  ] = useState(false)
  const [existedData, setExistedData] = useState<INotesSubject | null>(null)

  function updateTitleData(): void {
    setTitleData('loading')
    fetch(`${import.meta.env.VITE_API_HOST}/notes/workspace/get/${workspace}`)
      .then(async response => {
        const data = await response.json()
        setTitleData(data.data)

        if (response.status !== 200) {
          throw data.message
        }
      })
      .catch(() => {
        setTitleData('error')
        toast.error('Failed to fetch data from server.')
      })
  }

  function updateSubjectList(): void {
    setSubjectsData('loading')
    fetch(`${import.meta.env.VITE_API_HOST}/notes/subject/list/${workspace}`)
      .then(async response => {
        const data = await response.json()
        setSubjectsData(data.data)

        if (response.status !== 200) {
          throw data.message
        }
      })
      .catch(() => {
        setSubjectsData('error')
        toast.error('Failed to fetch data from server.')
      })
  }

  useEffect(() => {
    updateTitleData()
    updateSubjectList()
  }, [workspace])

  return (
    <section className="flex h-full min-h-0 w-full flex-1 flex-col overflow-y-scroll px-12">
      <Link
        to="/notes"
        className="mb-2 flex w-min items-center gap-2 rounded-lg p-2 pl-0 pr-4 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-100"
      >
        <Icon icon="tabler:chevron-left" className="text-xl" />
        <span className="whitespace-nowrap text-lg font-medium">Go back</span>
      </Link>
      <ModuleHeader
        title={
          <>
            Notes -{' '}
            {titleData === 'loading' ? (
              <Icon icon="svg-spinners:180-ring" className="h-8 w-8" />
            ) : titleData === 'error' ? (
              <span className="flex items-center gap-2 text-red-500">
                <Icon
                  icon="tabler:alert-triangle"
                  className="mt-1 h-8 w-8 stroke-red-500 stroke-[2px]"
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
      <>
        {(() => {
          switch (subjectsData) {
            case 'loading':
              return <Loading />
            case 'error':
              return <Error message="Failed to fetch data from server." />
            default:
              return subjectsData.length > 0 ? (
                <div className="grid grid-cols-4 items-center justify-center gap-4 py-8">
                  {subjectsData.map((subject, index) => (
                    <div
                      key={index}
                      className="group relative flex h-full w-full flex-col items-center rounded-lg bg-neutral-100 p-8 dark:bg-neutral-800/50"
                    >
                      <Icon
                        icon={subject.icon}
                        className="h-20 w-20 shrink-0 group-hover:text-custom-500"
                      />
                      <h2 className="mt-8 text-center text-2xl font-medium uppercase tracking-widest">
                        {subject.title}
                      </h2>
                      <p className="mt-2 text-center text-sm text-neutral-500">
                        {subject.description}
                      </p>
                      <Link
                        to={`/notes/${workspace}/${subject.id}`}
                        className="absolute left-0 top-0 h-full w-full hover:bg-white/[0.05]"
                      />
                      <Menu
                        as="div"
                        className="absolute right-4 top-4 overscroll-contain"
                      >
                        <Menu.Button className="rounded-md p-2 text-neutral-500 hover:bg-neutral-200/50 hover:text-neutral-500 dark:hover:bg-neutral-700/30">
                          <Icon
                            icon="tabler:dots-vertical"
                            className="h-5 w-5"
                          />
                        </Menu.Button>
                        <Transition
                          enter="transition duration-100 ease-out"
                          enterFrom="transform scale-95 opacity-0"
                          enterTo="transform scale-100 opacity-100"
                          leave="transition duration-75 ease-out"
                          leaveFrom="transform scale-100 opacity-100"
                          leaveTo="transform scale-95 opacity-0"
                          className="absolute right-0 top-3"
                        >
                          <Menu.Items className="mt-8 w-48 overflow-hidden overscroll-contain rounded-md bg-neutral-100 shadow-lg outline-none focus:outline-none dark:bg-neutral-800">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => {
                                    setExistedData(subject)
                                    setModifySubjectModalOpenType('update')
                                  }}
                                  className={`${
                                    active
                                      ? 'bg-neutral-200/50 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-100'
                                      : 'text-neutral-500'
                                  } flex w-full items-center p-4`}
                                >
                                  <Icon
                                    icon="tabler:edit"
                                    className="h-5 w-5"
                                  />
                                  <span className="ml-2">Edit</span>
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => {
                                    setExistedData(subject)
                                    setDeleteSubjectConfirmationModalOpen(true)
                                  }}
                                  className={`${
                                    active
                                      ? 'bg-neutral-200/50 text-red-600 dark:bg-neutral-700'
                                      : 'text-red-500'
                                  } flex w-full items-center p-4`}
                                >
                                  <Icon
                                    icon="tabler:trash"
                                    className="h-5 w-5"
                                  />
                                  <span className="ml-2">Delete</span>
                                </button>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setModifySubjectModalOpenType('create')
                      setExistedData(null)
                    }}
                    className="relative flex h-full flex-col items-center justify-center gap-6 rounded-lg border-2 border-dashed border-neutral-400 p-8 hover:bg-neutral-200 dark:border-neutral-700 dark:hover:bg-neutral-800/20"
                  >
                    <Icon
                      icon="tabler:folder-plus"
                      className="h-16 w-16 text-neutral-500"
                    />
                    <div className="text-2xl font-medium tracking-wide text-neutral-500">
                      Create subject
                    </div>
                  </button>
                </div>
              ) : (
                <EmptyStateScreen
                  title="A bit empty here. "
                  description="Create a new subject to start storing your notes."
                  icon="tabler:folder-off"
                  ctaContent="Create subject"
                  setModifyModalOpenType={setModifySubjectModalOpenType}
                />
              )
          }
        })()}
      </>
      <DeleteSubjectConfirmationModal
        isOpen={deleteSubjectConfirmationModalOpen}
        closeModal={() => {
          setDeleteSubjectConfirmationModalOpen(false)
        }}
        subjectDetails={existedData}
        updateSubjectList={updateSubjectList}
      />
      <ModifySubjectModal
        openType={modifySubjectModalOpenType}
        setOpenType={setModifySubjectModalOpenType}
        existedData={existedData}
        updateSubjectList={updateSubjectList}
      />
    </section>
  )
}

export default NotesCategory
