/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React, { useEffect, useState } from 'react'
// @ts-expect-error no types available
import Column from 'react-columns'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import useFetch from '@hooks/useFetch'
import { type IIdeaBoxEntry } from '@interfaces/ideabox_interfaces'
import ContainerHeader from '../Ideas/components/ContainerHeader'
import FAB from '../Ideas/components/FAB'
import EntryImage from '../Ideas/components/IdeaEntry/EntryImage'
import EntryLink from '../Ideas/components/IdeaEntry/EntryLink'
import EntryText from '../Ideas/components/IdeaEntry/EntryText'
import ModifyIdeaModal from '../Ideas/components/ModifyIdeaModal'

function Folder(): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { id, folderId } = useParams<{ id: string; folderId: string }>()
  const [viewArchived, setViewArchived] = useState(
    searchParams.get('archived') === 'true'
  )

  const [valid] = useFetch<boolean>(`idea-box/container/valid/${id}`)
  const [data, refreshData] = useFetch<IIdeaBoxEntry[]>(
    `idea-box/idea/${id}/${folderId}?archived=${viewArchived}`,
    valid === true
  )

  const [modifyIdeaModalOpenType, setModifyIdeaModalOpenType] = useState<
    null | 'create' | 'update' | 'paste'
  >(null)
  const [typeOfModifyIdea, setTypeOfModifyIdea] = useState<
    'text' | 'image' | 'link'
  >('text')
  const [existedData, setExistedData] = useState<IIdeaBoxEntry | null>(null)
  const [pastedData, setPastedData] = useState<{
    preview: string
    file: File
  } | null>(null)
  const [deleteIdeaModalOpen, setDeleteIdeaModalOpen] = useState(false)

  useEffect(() => {
    setSearchParams({ archived: viewArchived.toString() })
  }, [viewArchived])

  useEffect(() => {
    if (typeof valid === 'boolean' && !valid) {
      toast.error('Invalid ID')
      navigate('/idea-box')
    }
  }, [valid])

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
      <APIComponentWithFallback data={valid}>
        {() => (
          <>
            <ContainerHeader
              id={id!}
              viewArchived={viewArchived}
              setViewArchived={setViewArchived}
              folderId={folderId}
            />
            <APIComponentWithFallback data={data}>
              {data =>
                data.length > 0 ? (
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
                    className="mt-6 flex-1 shrink-0 !overflow-x-visible pb-8"
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
                          setTypeOfModifyIdea={setTypeOfModifyIdea}
                          setModifyIdeaModalOpenType={
                            setModifyIdeaModalOpenType
                          }
                          setExistedData={setExistedData}
                          setDeleteIdeaModalOpen={setDeleteIdeaModalOpen}
                          updateIdeaList={refreshData}
                        />
                      )
                    })}
                  </Column>
                ) : (
                  <EmptyStateScreen
                    onCTAClick={setModifyIdeaModalOpenType as any}
                    title="No ideas yet"
                    description="Hmm... Seems a bit empty here. Consider adding some innovative ideas."
                    icon="tabler:bulb-off"
                    ctaContent="new idea"
                  />
                )
              }
            </APIComponentWithFallback>
            <FAB
              setModifyIdeaModalOpenType={setModifyIdeaModalOpenType}
              setTypeOfModifyIdea={setTypeOfModifyIdea}
              setExistedData={setExistedData}
            />
            <ModifyIdeaModal
              openType={modifyIdeaModalOpenType}
              typeOfModifyIdea={typeOfModifyIdea}
              setOpenType={setModifyIdeaModalOpenType}
              containerId={id as string}
              updateIdeaList={refreshData}
              existedData={existedData}
              pastedData={pastedData}
            />
            <DeleteConfirmationModal
              isOpen={deleteIdeaModalOpen}
              onClose={() => {
                setDeleteIdeaModalOpen(false)
              }}
              apiEndpoint="idea-box/idea"
              itemName="idea"
              data={existedData}
              updateDataList={refreshData}
            />
          </>
        )}
      </APIComponentWithFallback>
    </ModuleWrapper>
  )
}

export default Folder
