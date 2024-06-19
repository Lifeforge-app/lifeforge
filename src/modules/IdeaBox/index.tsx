import { useDebounce } from '@uidotdev/usehooks'
import React, { useEffect, useState } from 'react'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import useFetch from '@hooks/useFetch'
import { type IIdeaBoxContainer } from '@interfaces/ideabox_interfaces'
import Containers from './components/Containers'
import ModifyContainerModal from './components/Containers/components/ModifyContainerModal'

function IdeaBox(): React.ReactElement {
  const [data, refreshData] =
    useFetch<IIdeaBoxContainer[]>('idea-box/container')
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
    <ModuleWrapper>
      <ModuleHeader
        title="Idea Box"
        desc="Sometimes you will randomly stumble upon a great idea."
      />
      <div className="mt-6 flex min-h-0 w-full flex-1 flex-col">
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          stuffToSearch="idea containers"
        />
        <APIComponentWithFallback data={data}>
          {typeof data !== 'string' &&
            (data.length > 0 ? (
              <Containers
                filteredList={filteredList}
                setCreateContainerModalOpen={setModifyContainerModalOpenType}
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
            ))}
        </APIComponentWithFallback>
      </div>
      <ModifyContainerModal
        openType={modifyContainerModalOpenType}
        setOpenType={setModifyContainerModalOpenType}
        updateContainerList={refreshData}
        existedData={existedData}
      />
      <DeleteConfirmationModal
        isOpen={deleteContainerConfirmationModalOpen}
        onClose={() => {
          setExistedData(null)
          setDeleteContainerConfirmationModalOpen(false)
        }}
        data={existedData}
        apiEndpoint="idea-box/container"
        itemName="container"
        updateDataList={refreshData}
      />
    </ModuleWrapper>
  )
}

export default IdeaBox
