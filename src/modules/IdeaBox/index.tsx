import { useDebounce } from '@uidotdev/usehooks'
import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIFallbackComponent from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import useFetch from '@hooks/useFetch'
import { type IIdeaBoxContainer } from '@interfaces/ideabox_interfaces'
import Containers from './components/Containers'
import ModifyContainerModal from './components/Containers/components/ModifyContainerModal'

function IdeaBox(): React.ReactElement {
  const [data, refreshData] = useFetch<IIdeaBoxContainer[]>(
    'idea-box/containers'
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
      <ModuleHeader icon="tabler:bulb" title="Idea Box" />
      <div className="mt-6 flex min-h-0 w-full flex-1 flex-col">
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          stuffToSearch="idea containers"
        />
        <APIFallbackComponent data={data}>
          {data =>
            data.length > 0 ? (
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
                onCTAClick={setModifyContainerModalOpenType}
                title={t('emptyState.ideaBox.title')}
                description={t('emptyState.ideaBox.description')}
                icon="tabler:cube-off"
                ctaContent="Create container"
              />
            )
          }
        </APIFallbackComponent>
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
        apiEndpoint="idea-box/containers"
        itemName="container"
        updateDataList={refreshData}
      />
    </ModuleWrapper>
  )
}

export default IdeaBox
