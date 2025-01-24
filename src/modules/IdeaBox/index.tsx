import { useDebounce } from '@uidotdev/usehooks'
import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { SearchInput } from '@components/inputs'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import DeleteConfirmationModal from '@components/modals/DeleteConfirmationModal'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import useFetch from '@hooks/useFetch'
import { type IIdeaBoxContainer } from '@interfaces/ideabox_interfaces'
import Containers from './components/Containers'
import ModifyContainerModal from './components/Containers/components/ModifyContainerModal'

function IdeaBox(): React.ReactElement {
  const [data, , setData] = useFetch<IIdeaBoxContainer[]>('idea-box/containers')
  const [modifyContainerModalOpenType, setModifyContainerModalOpenType] =
    useState<'create' | 'update' | null>(null)
  const [
    deleteContainerConfirmationModalOpen,
    setDeleteContainerConfirmationModalOpen
  ] = useState(false)
  const [existedData, setExistedData] = useState<IIdeaBoxContainer | null>(null)
  const [filteredList, setFilteredList] = useState<IIdeaBoxContainer[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 300)

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
        setContainerList={
          setData as React.Dispatch<React.SetStateAction<IIdeaBoxContainer[]>>
        }
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
        updateDataLists={() => {
          setData(prev =>
            typeof prev !== 'string'
              ? prev.filter(container => container.id !== existedData?.id)
              : prev
          )
        }}
      />
    </ModuleWrapper>
  )
}

export default IdeaBox
