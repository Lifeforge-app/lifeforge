import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import forgeAPI from '@utils/forgeAPI'
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
import type { InferOutput } from 'shared'

import ContainerList from './components/ContainerList'
import ModifyContainerModal from './components/ModifyContainerModal'

type IdeaBoxContainer = InferOutput<
  typeof forgeAPI.ideaBox.containers.list
>[number]

function IdeaBox() {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('apps.ideaBox')

  const query = useQuery(forgeAPI.ideaBox.containers.list.queryOptions())

  const [filteredList, setFilteredList] = useState<IdeaBoxContainer[]>([])

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
      type: 'create'
    })
  }, [])

  return (
    <ModuleWrapper>
      <ModuleHeader icon="tabler:bulb" title="Idea Box" />
      <SearchInput
        namespace="apps.ideaBox"
        searchTarget="container"
        setValue={setSearchQuery}
        value={searchQuery}
      />
      <QueryWrapper query={query}>
        {data =>
          data.length > 0 ? (
            <ContainerList filteredList={filteredList} />
          ) : (
            <EmptyStateScreen
              CTAButtonProps={{
                children: 'new',
                onClick: handleCreateContainer,
                icon: 'tabler:plus',
                tProps: { item: t('items.container') }
              }}
              icon="tabler:cube-off"
              name="container"
              namespace="apps.ideaBox"
            />
          )
        }
      </QueryWrapper>
    </ModuleWrapper>
  )
}

export default IdeaBox
