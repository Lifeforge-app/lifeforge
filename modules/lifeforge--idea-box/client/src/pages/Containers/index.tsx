import { useCallback, useState } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  ContextMenu,
  ContextMenuItem,
  EmptyStateScreen,
  FAB,
  ModuleHeader,
  SearchInput,
  WithQueryData,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import ContainerList from './components/ContainerList'
import ModifyContainerModal from './components/ModifyContainerModal'

function IdeaBox() {
  const { open } = useModalStore()
  const { t } = useModuleTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [showhidden, setShowhidden] = useState(false)

  const handleCreateContainer = useCallback(() => {
    open(ModifyContainerModal, {
      type: 'create'
    })
  }, [])

  return (
    <>
      <ModuleHeader
        trailing={
          <>
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
            <ContextMenu>
              <ContextMenuItem
                icon="tabler:eye-off"
                label={showhidden ? 'Hide Hidden' : 'Show Hidden'}
                onClick={() => setShowhidden(prev => !prev)}
              />
            </ContextMenu>
          </>
        }
      />
      <SearchInput
        debounceMs={300}
        searchTarget="container"
        value={searchQuery}
        onChange={setSearchQuery}
      />
      <WithQueryData
        contract={forgeAPI.containers.list.input({
          hidden: showhidden.toString()
        })}
      >
        {data => {
          if (data.length === 0) {
            return (
              <EmptyStateScreen
                icon="tabler:cube-off"
                message={{
                  id: 'container'
                }}
              />
            )
          }

          const filteredList = data.filter(container =>
            container.name.toLowerCase().includes(searchQuery.toLowerCase())
          )

          if (filteredList.length === 0) {
            return (
              <EmptyStateScreen
                icon="tabler:search-off"
                message={{
                  id: 'containerSearch'
                }}
              />
            )
          }

          return <ContainerList filteredList={filteredList} />
        }}
      </WithQueryData>
      <FAB visibilityBreakpoint="md" onClick={handleCreateContainer} />
    </>
  )
}

export default IdeaBox
