import React from 'react'
import { useParams } from 'react-router-dom'
import { SearchInput } from '@components/inputs'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import IdeaBoxProvider, { useIdeaBoxContext } from '@providers/IdeaBoxProvider'
import ContainerHeader from './components/ContainerHeader'
import FAB from './components/FAB'
import IdeaAndFolderList from './components/IdeaAndFolderList'
import DeleteModals from './components/Modals/DeleteModals'
import ModifyFolderModal from './components/Modals/ModifyFolderModal'
import ModifyIdeaModal from './components/Modals/ModifyIdeaModal'
import ModifyTagModal from './components/Modals/ModifyTagModal'
import TagsSelector from './components/TagsSelector'

function IdeasInsideProvider(): React.ReactElement {
  const { '*': path } = useParams<{ '*': string }>()
  const { valid, searchQuery, setSearchQuery, viewArchived } =
    useIdeaBoxContext()

  return (
    <ModuleWrapper>
      <APIFallbackComponent data={valid}>
        {() => (
          <>
            <ContainerHeader />
            {!viewArchived && (
              <SearchInput
                namespace="modules.ideaBox"
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                stuffToSearch={path === '' ? 'idea' : 'ideaInFolder'}
              />
            )}
            <TagsSelector />
            <IdeaAndFolderList />
            <FAB />
            <ModifyIdeaModal />
            <ModifyFolderModal />
            <ModifyTagModal />
            <DeleteModals />
          </>
        )}
      </APIFallbackComponent>
    </ModuleWrapper>
  )
}

function Ideas(): React.ReactElement {
  return (
    <IdeaBoxProvider>
      <IdeasInsideProvider />
    </IdeaBoxProvider>
  )
}

export default Ideas
