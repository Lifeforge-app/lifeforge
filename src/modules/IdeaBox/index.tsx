import { useDebounce } from '@uidotdev/usehooks'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation('modules.ideaBox')
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
          namespace="modules.ideaBox"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          stuffToSearch="container"
        />
        <APIFallbackComponent data={data}>
          {data =>
            data.length > 0 ? (
              <Containers
                filteredList={filteredList}
                setCreateContainerModalOpen={setModifyContainerModalOpenType}
                setDeleteContainerConfirmationModalOpen={
                  setDeleteContainerConfirmationModalOpen
                }
                setExistedData={setExistedData}
              />
            ) : (
              <EmptyStateScreen
                ctaContent="new"
                ctaTProps={{
                  item: t('items.container')
                }}
                icon="tabler:cube-off"
                name="container"
                namespace="modules.ideaBox"
                onCTAClick={setModifyContainerModalOpenType}
              />
            )
          }
        </APIFallbackComponent>
      </div>
      <ModifyContainerModal
        existedData={existedData}
        openType={modifyContainerModalOpenType}
        setContainerList={
          setData as React.Dispatch<React.SetStateAction<IIdeaBoxContainer[]>>
        }
        setOpenType={setModifyContainerModalOpenType}
      />
      <DeleteConfirmationModal
        apiEndpoint="idea-box/containers"
        data={existedData}
        isOpen={deleteContainerConfirmationModalOpen}
        itemName="container"
        updateDataLists={() => {
          setData(prev =>
            typeof prev !== 'string'
              ? prev.filter(container => container.id !== existedData?.id)
              : prev
          )
        }}
        onClose={() => {
          setExistedData(null)
          setDeleteContainerConfirmationModalOpen(false)
        }}
      />
    </ModuleWrapper>
  )
}

export default IdeaBox
