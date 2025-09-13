import { useDebounce } from '@uidotdev/usehooks'
import forgeAPI from '@utils/forgeAPI'
import {
  Button,
  ContextMenuItem,
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

  const [showhidden, setShowhidden] = useState(false)

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
            tProps={{
              item: t('items.container')
            }}
            onClick={handleCreateContainer}
          >
            new
          </Button>
        }
        contextMenuProps={{
          children: (
            <>
              <ContextMenuItem
                icon="tabler:eye-off"
                label={showhidden ? 'Hide Hidden' : 'Show Hidden'}
                namespace="apps.ideaBox"
                onClick={() => setShowhidden(prev => !prev)}
              />
            </>
          )
        }}
      />
      <SearchInput
        namespace="apps.ideaBox"
        searchTarget="container"
        setValue={setSearchQuery}
        value={searchQuery}
      />
      <WithQueryData
        controller={forgeAPI.ideaBox.containers.list.input({
          hidden: showhidden.toString()
        })}
      >
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
