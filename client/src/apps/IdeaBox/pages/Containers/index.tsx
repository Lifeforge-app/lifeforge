import { useDebounce } from '@uidotdev/usehooks'
import forgeAPI from '@utils/forgeAPI'
import {
  Button,
  EmptyStateScreen,
  ModuleHeader,
  SearchInput,
  WithQueryData
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import ContainerList from './components/ContainerList'
import ModifyContainerModal from './components/ModifyContainerModal'

function IdeaBox() {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('apps.ideaBox')

  const [searchQuery, setSearchQuery] = useState('')

  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 300)

  const handleCreateContainer = useCallback(() => {
    open(ModifyContainerModal, {
      type: 'create'
    })
  }, [])

  return (
    <>
      <ModuleHeader
        actionButton={
          <Button
            className="ml-4 hidden md:flex"
            icon="tabler:plus"
            namespace="apps.ideaBox"
            tProps={{
              item: t('items.container')
            }}
            onClick={handleCreateContainer}
          >
            new
          </Button>
        }
      />
      <SearchInput
        namespace="apps.ideaBox"
        searchTarget="container"
        setValue={setSearchQuery}
        value={searchQuery}
      />
      <WithQueryData controller={forgeAPI.ideaBox.containers.list}>
        {data => {
          if (data.length === 0) {
            return (
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

          const filteredList = data.filter(container =>
            container.name.toLowerCase().includes(debouncedSearchQuery)
          )

          if (filteredList.length === 0) {
            return (
              <EmptyStateScreen
                icon="tabler:search-off"
                name="containerSearch"
                namespace="apps.ideaBox"
              />
            )
          }

          return <ContainerList filteredList={filteredList} />
        }}
      </WithQueryData>
    </>
  )
}

export default IdeaBox
