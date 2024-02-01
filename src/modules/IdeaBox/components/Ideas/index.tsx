/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/indent */
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
// @ts-expect-error - no types available
import Column from 'react-columns'
import Loading from '../../../../components/general/Loading'
import Error from '../../../../components/general/Error'
import EmptyStateScreen from '../../../../components/general/EmptyStateScreen'
import ModifyIdeaModal from './components/ModifyIdeaModal'
import EntryImage from './components/IdeaEntry/EntryImage'
import EntryText from './components/IdeaEntry/EntryText'
import EntryLink from './components/IdeaEntry/EntryLink'
import ContainerHeader from './components/ContainerHeader'
import FAB from './components/FAB'
import DeleteConfirmationModal from '../../../../components/general/DeleteConfirmationModal'
import useFetch from '../../../../hooks/useFetch'

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
  archived: boolean
}

function Ideas(): React.JSX.Element {
  const { id } = useParams<{ id: string }>()

  const [data, refreshData] = useFetch<IIdeaBoxEntry[]>(
    `idea-box/idea/list/${id}`
  )

  const [modifyIdeaModalOpenType, setModifyIdeaModalOpenType] = useState<
    null | 'create' | 'update'
  >(null)
  const [typeOfModifyIdea, setTypeOfModifyIdea] = useState<
    'text' | 'image' | 'link'
  >('text')
  const [existedData, setExistedData] = useState<IIdeaBoxEntry | null>(null)
  const [deleteIdeaModalOpen, setDeleteIdeaModalOpen] = useState(false)

  return (
    <>
      <section className="relative min-h-0 w-full min-w-0 flex-1 overflow-y-auto">
        <ContainerHeader id={id!} />
        {(() => {
          switch (data) {
            case 'loading':
              return <Loading />
            case 'error':
              return <Error message="Failed to fetch data from server." />
            default:
              return data.length > 0 ? (
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
                  className="mt-8 h-max px-8 sm:px-12"
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
                        setModifyIdeaModalOpenType={setModifyIdeaModalOpenType}
                        setExistedData={setExistedData}
                        setDeleteIdeaModalOpen={setDeleteIdeaModalOpen}
                        updateIdeaList={refreshData}
                      />
                    )
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
      <ModifyIdeaModal
        openType={modifyIdeaModalOpenType}
        typeOfModifyIdea={typeOfModifyIdea}
        setOpenType={setModifyIdeaModalOpenType}
        containerId={id as string}
        updateIdeaList={refreshData}
        existedData={existedData}
      />
      <DeleteConfirmationModal
        isOpen={deleteIdeaModalOpen}
        closeModal={() => {
          setDeleteIdeaModalOpen(false)
        }}
        apiEndpoint="idea-box/idea/delete"
        itemName="idea"
        data={existedData}
        updateDataList={refreshData}
      />
    </>
  )
}

export default Ideas
