import { useDebounce } from '@uidotdev/usehooks'
import {
  EmptyStateScreen,
  ModuleHeader,
  ModuleWrapper,
  QueryWrapper,
  SearchInput
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAPIQuery } from 'shared/lib'
import {
  ISchemaWithPB,
  IdeaBoxCollectionsSchemas
} from 'shared/types/collections'
import { IdeaBoxControllersSchemas } from 'shared/types/controllers'

import ContainerList from './components/ContainerList'
import ModifyContainerModal from './components/ModifyContainerModal'

function IdeaBox() {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('apps.ideaBox')

  const query = useAPIQuery<
    IdeaBoxControllersSchemas.IContainers['getContainers']['response']
  >('idea-box/containers', ['idea-box', 'containers'])

  const [filteredList, setFilteredList] = useState<
    ISchemaWithPB<IdeaBoxCollectionsSchemas.IContainerAggregated>[]
  >([])

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

  const handleCreateContainer = useCallback(() => {
    open(ModifyContainerModal, {
      type: 'create',
      existedData: null
    })
  }, [])

  return (
    <ModuleWrapper>
      <ModuleHeader icon="tabler:bulb" title="Idea Box" />
      <SearchInput
        namespace="apps.ideaBox"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        stuffToSearch="container"
      />
      <QueryWrapper query={query}>
        {data =>
          data.length > 0 ? (
            <ContainerList filteredList={filteredList} />
          ) : (
            <EmptyStateScreen
              ctaContent="new"
              ctaTProps={{
                item: t('items.container')
              }}
              icon="tabler:cube-off"
              name="container"
              namespace="apps.ideaBox"
              onCTAClick={handleCreateContainer}
            />
          )
        }
      </QueryWrapper>
    </ModuleWrapper>
  )
}

export default IdeaBox
