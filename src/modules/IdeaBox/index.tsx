/* eslint-disable @typescript-eslint/indent */
/* eslint-disable multiline-ternary */
import React, { useEffect, useState } from 'react'
import ModuleHeader from '../../components/ModuleHeader'
import { Icon } from '@iconify/react'
import { toast } from 'react-toastify'
import Loading from '../../components/Loading'
import Error from '../../components/Error'
import ModifyContainerModal from './components/ContainerList/ModifyContainerModal'
import { useDebounce } from '@uidotdev/usehooks'
import EmptyStateScreen from '../../components/EmptyStateScreen'
import ContainerGrid from './components/ContainerList/ContainerGrid'
import DeleteContainerConfirmationModal from './components/ContainerList/DeleteContainerConfirmationModal.1'

export interface IIdeaBoxContainer {
  collectionId: string
  collectionName: string
  color: string
  created: string
  icon: string
  id: string
  image_count: number
  link_count: number
  name: string
  text_count: number
  updated: string
}

function IdeaBox(): React.JSX.Element {
  const [data, setData] = useState<IIdeaBoxContainer[] | 'error' | 'loading'>(
    'loading'
  )
  const [modifyContainerModalOpenType, setModifyContainerModalOpenType] =
    useState<'create' | 'update' | null>(null)
  const [
    deleteContainerConfirmationModalOpen,
    setDeleteContainerConfirmationModalOpen
  ] = useState(false)
  const [existedData, setExistedData] = useState<IIdeaBoxContainer | null>(null)
  const [filteredList, setFilteredList] = useState<IIdeaBoxContainer[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  function updateContainerList(): void {
    setData('loading')
    fetch(`${import.meta.env.VITE_API_HOST}/idea-box/container/list`)
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
    updateContainerList()
  }, [])

  useEffect(() => {
    if (Array.isArray(data)) {
      if (debouncedSearchQuery.length === 0) {
        setFilteredList(data)
      } else {
        setFilteredList(
          data.filter(container =>
            container.name
              .toLowerCase()
              .includes(debouncedSearchQuery.toLowerCase())
          )
        )
      }
    }
  }, [debouncedSearchQuery, data])

  return (
    <section className="flex h-full min-h-0 w-full flex-1 flex-col px-12">
      <ModuleHeader
        title="Idea Box"
        desc="Sometimes you will randomly stumble upon a great idea."
      />
      <div className="mt-8 flex min-h-0 w-full flex-1 flex-col">
        <search className="flex w-full items-center gap-4 rounded-lg bg-neutral-50 p-4 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-neutral-800/50">
          <Icon icon="tabler:search" className="h-5 w-5 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value)
            }}
            placeholder="Search idea containers ..."
            className="w-full bg-transparent text-neutral-500 placeholder:text-neutral-400 focus:outline-none"
          />
        </search>
        <>
          {(() => {
            switch (data) {
              case 'loading':
                return <Loading />
              case 'error':
                return <Error message="Failed to fetch data from server." />
              default:
                return data.length > 0 ? (
                  <ContainerGrid
                    filteredList={filteredList}
                    setCreateContainerModalOpen={
                      setModifyContainerModalOpenType
                    }
                    setExistedData={setExistedData}
                    setDeleteContainerConfirmationModalOpen={
                      setDeleteContainerConfirmationModalOpen
                    }
                  />
                ) : (
                  <EmptyStateScreen
                    setModifyModalOpenType={setModifyContainerModalOpenType}
                    title="No idea containers"
                    description="Hmm... Seems a bit empty here. Consider creating one."
                    icon="tabler:cube-off"
                    ctaContent="Create container"
                  />
                )
            }
          })()}
        </>
      </div>
      <ModifyContainerModal
        openType={modifyContainerModalOpenType}
        setOpenType={setModifyContainerModalOpenType}
        updateContainerList={updateContainerList}
        existedData={existedData}
      />
      <DeleteContainerConfirmationModal
        isOpen={deleteContainerConfirmationModalOpen}
        closeModal={() => {
          setExistedData(null)
          setDeleteContainerConfirmationModalOpen(false)
        }}
        containerDetails={existedData}
        updateContainerList={updateContainerList}
      />
    </section>
  )
}

export default IdeaBox
