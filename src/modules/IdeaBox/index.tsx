import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SearchInput } from '@components/inputs'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import DeleteConfirmationModal from '@components/modals/DeleteConfirmationModal'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import QueryWrapper from '@components/screens/QueryWrapper'
import { type IIdeaBoxContainer } from '@interfaces/ideabox_interfaces'
import fetchAPI from '@utils/fetchAPI'
import Containers from './components/Containers'
import ModifyContainerModal from './components/Containers/components/ModifyContainerModal'

function IdeaBox(): React.ReactElement {
  const { t } = useTranslation('modules.ideaBox')
  const query = useQuery<IIdeaBoxContainer[]>({
    queryKey: ['idea-box', 'containers'],
    queryFn: () => fetchAPI('idea-box/containers')
  })

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
    if (Array.isArray(query.data)) {
      if (debouncedSearchQuery.length === 0) {
        setFilteredList(query.data)
      } else {
        setFilteredList(
          query.data.filter(container =>
            container.name
              .toLowerCase()
              .includes(debouncedSearchQuery.toLowerCase())
          )
        )
      }
    }
  }, [debouncedSearchQuery, query.data])

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
        <QueryWrapper query={query}>
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
        </QueryWrapper>
      </div>
      <ModifyContainerModal
        existedData={existedData}
        openType={modifyContainerModalOpenType}
        setOpenType={setModifyContainerModalOpenType}
      />
      <DeleteConfirmationModal
        apiEndpoint="idea-box/containers"
        data={existedData}
        isOpen={deleteContainerConfirmationModalOpen}
        itemName="container"
        queryKey={['idea-box', 'containers']}
        onClose={() => {
          setExistedData(null)
          setDeleteContainerConfirmationModalOpen(false)
        }}
      />
    </ModuleWrapper>
  )
}

export default IdeaBox
