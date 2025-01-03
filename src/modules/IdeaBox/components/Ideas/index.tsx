/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Icon } from '@iconify/react'
import { useDebounce } from '@uidotdev/usehooks'
import React, { useEffect, useState } from 'react'
// @ts-expect-error no types available
import Column from 'react-columns'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIFallbackComponent from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import useFetch from '@hooks/useFetch'
import {
  type IIdeaBoxEntry,
  type IIdeaBoxFolder
} from '@interfaces/ideabox_interfaces'
import APIRequest from '@utils/fetchData'
import ContainerHeader from './components/ContainerHeader'
import FAB from './components/FAB'
import FolderItem from './components/FolderItem'
import EntryImage from './components/IdeaEntry/EntryImage'
import EntryLink from './components/IdeaEntry/EntryLink'
import EntryText from './components/IdeaEntry/EntryText'
import ModifyFolderModal from './components/ModifyFolderModal'
import ModifyIdeaModal from './components/ModifyIdeaModal'

function Ideas(): React.ReactElement {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { id, '*': path } = useParams<{ id: string; '*': string }>()
  const [viewArchived, setViewArchived] = useState(
    searchParams.get('archived') === 'true'
  )

  const [valid] = useFetch<boolean>(`idea-box/valid/${id}/${path}`)
  const [data, setData] = useState<IIdeaBoxEntry[] | 'loading' | 'error'>(
    'loading'
  )
  const [folders, setFolders] = useState<
    IIdeaBoxFolder[] | 'loading' | 'error'
  >('loading')

  const [modifyIdeaModalOpenType, setModifyIdeaModalOpenType] = useState<
    null | 'create' | 'update' | 'paste'
  >(null)
  const [modifyFolderModalOpenType, setModifyFolderModalOpenType] = useState<
    null | 'create' | 'update'
  >(null)
  const [typeOfModifyIdea, setTypeOfModifyIdea] = useState<
    'text' | 'image' | 'link'
  >('text')
  const [existedData, setExistedData] = useState<IIdeaBoxEntry | null>(null)
  const [pastedData, setPastedData] = useState<{
    preview: string
    file: File
  } | null>(null)
  const [existedFolderData, setExistedFolderData] =
    useState<IIdeaBoxFolder | null>(null)
  const [deleteIdeaModalOpen, setDeleteIdeaModalOpen] = useState(false)
  const [deleteFolderModalOpen, setDeleteFolderModalOpen] = useState(false)
  const [searchResults, setSearchResults] = useState<
    IIdeaBoxEntry[] | 'loading' | 'error'
  >([])
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  useEffect(() => {
    setSearchParams({ archived: viewArchived.toString() })
  }, [viewArchived])

  useEffect(() => {
    if (typeof valid === 'boolean' && !valid) {
      toast.error('Invalid ID')
      navigate('/idea-box')
    }
  }, [valid])

  function refreshData(): void {
    setData('loading')
    APIRequest({
      endpoint: `idea-box/ideas/${id}/${path}?archived=${viewArchived}`,
      method: 'GET',
      callback: data => {
        setData(data.data)
      }
    }).catch(console.error)
  }

  function refreshFolders(): void {
    setFolders('loading')
    APIRequest({
      endpoint: `idea-box/folders/${id}/${path}`,
      method: 'GET',
      callback: data => {
        setFolders(data.data)
      }
    }).catch(console.error)
  }

  function refreshSearchResults(): void {
    setSearchResults('loading')
    APIRequest({
      endpoint: `idea-box/search?q=${encodeURIComponent(
        debouncedSearchQuery.trim()
      )}&container=${id}`,
      method: 'GET',
      callback: data => {
        setSearchResults(data.data)
      },
      onFailure: () => {
        setSearchResults('error')
      }
    }).catch(console.error)
  }

  useEffect(() => {
    if (valid === true) {
      refreshData()
      refreshFolders()
    }
  }, [id, path, viewArchived, valid])

  useEffect(() => {
    if (debouncedSearchQuery.trim().length > 0) {
      refreshSearchResults()
    } else {
      setSearchResults([])
    }
  }, [debouncedSearchQuery])

  function onPasteImage(event: ClipboardEvent): void {
    if (modifyIdeaModalOpenType !== null) return

    const items = event.clipboardData?.items

    let pastedImage: DataTransferItem | undefined

    for (let i = 0; i < items!.length; i++) {
      if (items![i].type.includes('image')) {
        pastedImage = items![i]
        break
      }
    }

    if (pastedImage === undefined) {
      return
    }

    if (!pastedImage.type.includes('image')) {
      toast.error('Invalid image in clipboard.')
      return
    }

    const file = pastedImage.getAsFile()
    const reader = new FileReader()

    if (file !== null) {
      reader.readAsDataURL(file)
    }

    reader.onload = function () {
      if (file !== null) {
        setModifyIdeaModalOpenType('paste')
        setTypeOfModifyIdea('image')
        setPastedData({
          preview: reader.result as string,
          file
        })
      }
    }
  }

  useEffect(() => {
    document.addEventListener('paste', onPasteImage)

    return () => {
      document.removeEventListener('paste', onPasteImage)
    }
  }, [modifyIdeaModalOpenType])

  return (
    <ModuleWrapper>
      <APIFallbackComponent data={valid}>
        {() => (
          <>
            <ContainerHeader
              valid={valid}
              viewArchived={viewArchived}
              setViewArchived={setViewArchived}
            />
            <SearchInput
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              stuffToSearch="ideas"
            />
            <div className="mb-20 mt-6">
              {debouncedSearchQuery.trim().length === 0 ? (
                <APIFallbackComponent data={data}>
                  {data => (
                    <APIFallbackComponent data={folders}>
                      {folders => (
                        <>
                          {typeof folders !== 'string' &&
                            (data.length === 0 && folders.length === 0 ? (
                              !viewArchived ? (
                                <EmptyStateScreen
                                  onCTAClick={setModifyIdeaModalOpenType as any}
                                  title="No ideas yet"
                                  description="Hmm... Seems a bit empty here. Consider adding some innovative ideas."
                                  icon="tabler:bulb-off"
                                  ctaContent="new idea"
                                />
                              ) : (
                                <EmptyStateScreen
                                  title="No archived ideas"
                                  description="You don't have any archived ideas yet."
                                  icon="tabler:archive-off"
                                />
                              )
                            ) : (
                              <>
                                {folders.length > 0 && !viewArchived && (
                                  <>
                                    <h2 className="mb-2 flex items-center gap-2 text-lg font-medium text-bg-500">
                                      <Icon
                                        icon="tabler:folder"
                                        className="size-6"
                                      />
                                      {t('ideaBox.entryType.folder')}
                                    </h2>
                                    <div className="mt-2 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                                      {folders.map(folder => (
                                        <FolderItem
                                          key={folder.id}
                                          folder={folder}
                                          setIdeaList={setData}
                                          setFolderList={setFolders}
                                          setExistedFolderData={
                                            setExistedFolderData
                                          }
                                          setModifyFolderModalOpenType={
                                            setModifyFolderModalOpenType
                                          }
                                          setDeleteFolderConfirmationModalOpen={
                                            setDeleteFolderModalOpen
                                          }
                                        />
                                      ))}
                                    </div>
                                  </>
                                )}
                                {data.length > 0 && (
                                  <Column
                                    queries={[
                                      {
                                        columns: 1,
                                        query: 'min-width: 0px'
                                      },
                                      {
                                        columns: 2,
                                        query: 'min-width: 768px'
                                      },
                                      {
                                        columns: 3,
                                        query: 'min-width: 1024px'
                                      },
                                      {
                                        columns: 4,
                                        query: 'min-width: 1280px'
                                      },
                                      {
                                        columns: 5,
                                        query: 'min-width: 1536px'
                                      }
                                    ]}
                                    gap="0.5rem"
                                    className="mb-8 mt-6 shrink-0 !overflow-x-visible"
                                  >
                                    {data.map(entry => {
                                      const Component = {
                                        image: EntryImage,
                                        text: EntryText,
                                        link: EntryLink
                                      }[entry.type]

                                      return (
                                        <Component
                                          key={entry.id}
                                          entry={entry}
                                          setTypeOfModifyIdea={
                                            setTypeOfModifyIdea
                                          }
                                          setModifyIdeaModalOpenType={
                                            setModifyIdeaModalOpenType
                                          }
                                          setExistedData={setExistedData}
                                          setDeleteIdeaModalOpen={
                                            setDeleteIdeaModalOpen
                                          }
                                          setIdeaList={
                                            setData as React.Dispatch<
                                              React.SetStateAction<
                                                IIdeaBoxEntry[]
                                              >
                                            >
                                          }
                                        />
                                      )
                                    })}
                                  </Column>
                                )}
                              </>
                            ))}
                        </>
                      )}
                    </APIFallbackComponent>
                  )}
                </APIFallbackComponent>
              ) : (
                <APIFallbackComponent data={searchResults}>
                  {searchResults => (
                    <>
                      {searchResults.length === 0 ? (
                        <EmptyStateScreen
                          title="No results"
                          description="No ideas found for your search query."
                          icon="tabler:search"
                        />
                      ) : (
                        <Column
                          queries={[
                            {
                              columns: 1,
                              query: 'min-width: 0px'
                            },
                            {
                              columns: 2,
                              query: 'min-width: 768px'
                            },
                            {
                              columns: 3,
                              query: 'min-width: 1024px'
                            },
                            {
                              columns: 4,
                              query: 'min-width: 1280px'
                            },
                            {
                              columns: 5,
                              query: 'min-width: 1536px'
                            }
                          ]}
                          gap="0.5rem"
                          className="mb-8 mt-6 shrink-0 !overflow-x-visible"
                        >
                          {searchResults.map(entry => {
                            const Component = {
                              image: EntryImage,
                              text: EntryText,
                              link: EntryLink
                            }[entry.type]

                            return (
                              <Component
                                key={entry.id}
                                entry={entry}
                                setTypeOfModifyIdea={setTypeOfModifyIdea}
                                setModifyIdeaModalOpenType={
                                  setModifyIdeaModalOpenType
                                }
                                setExistedData={setExistedData}
                                setDeleteIdeaModalOpen={setDeleteIdeaModalOpen}
                                setIdeaList={
                                  setData as React.Dispatch<
                                    React.SetStateAction<IIdeaBoxEntry[]>
                                  >
                                }
                              />
                            )
                          })}
                        </Column>
                      )}
                    </>
                  )}
                </APIFallbackComponent>
              )}
            </div>
            <FAB
              setModifyIdeaModalOpenType={setModifyIdeaModalOpenType}
              setTypeOfModifyIdea={setTypeOfModifyIdea}
              setExistedData={setExistedData}
              setModifyFolderModalOpenType={setModifyFolderModalOpenType}
              setExistedFolderData={setExistedFolderData}
            />
            <ModifyIdeaModal
              openType={modifyIdeaModalOpenType}
              typeOfModifyIdea={typeOfModifyIdea}
              setOpenType={setModifyIdeaModalOpenType}
              setIdeaList={
                (debouncedSearchQuery.trim().length > 0
                  ? setSearchResults
                  : setData) as React.Dispatch<
                  React.SetStateAction<IIdeaBoxEntry[]>
                >
              }
              existedData={existedData}
              pastedData={pastedData}
            />
            <ModifyFolderModal
              openType={modifyFolderModalOpenType}
              setOpenType={setModifyFolderModalOpenType}
              updateFolderList={refreshFolders}
              existedData={existedFolderData}
            />
            <DeleteConfirmationModal
              isOpen={deleteIdeaModalOpen}
              onClose={() => {
                setDeleteIdeaModalOpen(false)
              }}
              apiEndpoint="idea-box/ideas"
              itemName="idea"
              data={existedData}
              updateDataLists={() => {
                ;(debouncedSearchQuery.trim().length > 0
                  ? setSearchResults
                  : setData)(prevData =>
                  typeof prevData !== 'string'
                    ? prevData.filter(entry => entry.id !== existedData?.id)
                    : prevData
                )
              }}
            />
            <DeleteConfirmationModal
              isOpen={deleteFolderModalOpen}
              onClose={() => {
                setDeleteFolderModalOpen(false)
              }}
              apiEndpoint="idea-box/folders"
              itemName="folder"
              data={existedFolderData}
              updateDataLists={refreshFolders}
            />
          </>
        )}
      </APIFallbackComponent>
    </ModuleWrapper>
  )
}

export default Ideas
