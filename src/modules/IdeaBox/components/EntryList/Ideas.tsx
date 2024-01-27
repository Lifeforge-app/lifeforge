/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/indent */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
// @ts-expect-error - no types available
import Column from 'react-columns'
import { toast } from 'react-toastify'
import Loading from '../../../../components/Loading'
import Error from '../../../../components/Error'
import EmptyStateScreen from '../../../../components/EmptyStateScreen'
import CreateIdeaModal from './ModifyIdeaModal'
import DeleteIdeaConfirmationModal from './DeleteIdeaConfirmationModal'
import EntryImage from './IdeaEntry/EntryImage'
import EntryText from './IdeaEntry/EntryText'
import EntryLink from './IdeaEntry/EntryLink'
import ContainerHeader from './ContainerHeader'
import FAB from './FAB'

export interface IIdeaBoxEntry {
  collectionId: string
  collectionName: string
  container: string
  content: string
  created: string
  id: string
  image: string
  title: string
  type: 'text' | 'image' | 'link'
  updated: string
  pinned: boolean
}

function Ideas(): React.JSX.Element {
  const { id } = useParams<{ id: string }>()

  const [data, setData] = useState<IIdeaBoxEntry[] | 'error' | 'loading'>(
    'loading'
  )

  const [modifyIdeaModalOpenType, setModifyIdeaModalOpenType] = useState<
    null | 'create' | 'update'
  >(null)
  const [typeOfModifyIdea, setTypeOfModifyIdea] = useState<
    'text' | 'image' | 'link'
  >('text')
  const [existedData, setExistedData] = useState<IIdeaBoxEntry | null>(null)
  const [deleteIdeaModalOpen, setDeleteIdeaModalOpen] = useState(false)

  function updateIdeaList(): void {
    setData('loading')
    fetch(`${import.meta.env.VITE_API_HOST}/idea-box/idea/list/${id}`)
      .then(async response => {
        const data = await response.json()
        setData(data.data)

        if (response.status !== 200) {
          throw data.message
        }
      })
      .catch(() => {
        setData('error')
        toast.error('Failed to fetch data from server.')
      })
  }

  useEffect(() => {
    updateIdeaList()
  }, [])

  return (
    <>
      <section className="relative min-h-0 w-full min-w-0 flex-1 overflow-y-auto px-12">
        <ContainerHeader id={id!} />
        {(() => {
          switch (data) {
            case 'loading':
              return <Loading />
            case 'error':
              return <Error message="Failed to fetch data from server." />
            default:
              return data.length > 0 ? (
                <Column columns={4} gap="0.5rem" className="mt-8 h-max px-2">
                  {data.map(entry => {
                    switch (entry.type) {
                      case 'image':
                        return (
                          <EntryImage
                            entry={entry}
                            setTypeOfModifyIdea={setTypeOfModifyIdea}
                            setModifyIdeaModalOpenType={
                              setModifyIdeaModalOpenType
                            }
                            setExistedData={setExistedData}
                            setDeleteIdeaModalOpen={setDeleteIdeaModalOpen}
                            updateIdeaList={updateIdeaList}
                          />
                        )
                      case 'text':
                        return (
                          <EntryText
                            entry={entry}
                            setTypeOfModifyIdea={setTypeOfModifyIdea}
                            setModifyIdeaModalOpenType={
                              setModifyIdeaModalOpenType
                            }
                            setExistedData={setExistedData}
                            setDeleteIdeaModalOpen={setDeleteIdeaModalOpen}
                            updateIdeaList={updateIdeaList}
                          />
                        )
                      case 'link':
                        return (
                          <EntryLink
                            entry={entry}
                            setTypeOfModifyIdea={setTypeOfModifyIdea}
                            setModifyIdeaModalOpenType={
                              setModifyIdeaModalOpenType
                            }
                            setExistedData={setExistedData}
                            setDeleteIdeaModalOpen={setDeleteIdeaModalOpen}
                            updateIdeaList={updateIdeaList}
                          />
                        )
                    }
                    return <></>
                  })}
                </Column>
              ) : (
                <EmptyStateScreen
                  setModifyModalOpenType={setModifyIdeaModalOpenType}
                  title="No ideas yet"
                  description="Hmm... Seems a bit empty here. Consider adding some innovative ideas."
                  icon="tabler:bulb-off"
                  ctaContent="new idea"
                />
              )
          }
        })()}
        <FAB
          setModifyIdeaModalOpenType={setModifyIdeaModalOpenType}
          setTypeOfModifyIdea={setTypeOfModifyIdea}
        />
      </section>
      <CreateIdeaModal
        openType={modifyIdeaModalOpenType}
        typeOfModifyIdea={typeOfModifyIdea}
        setOpenType={setModifyIdeaModalOpenType}
        containerId={id as string}
        updateIdeaList={updateIdeaList}
        existedData={existedData}
      />
      <DeleteIdeaConfirmationModal
        isOpen={deleteIdeaModalOpen}
        closeModal={() => {
          setDeleteIdeaModalOpen(false)
        }}
        ideaDetails={existedData}
        setData={setData}
      />
    </>
  )
}

export default Ideas
