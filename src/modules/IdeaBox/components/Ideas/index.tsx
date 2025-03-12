import React from 'react'
import { useParams } from 'react-router'

import { SearchInput , ModuleWrapper } from '@lifeforge/ui'

import IdeaBoxProvider, {
  useIdeaBoxContext
} from '@modules/IdeaBox/providers/IdeaBoxProvider'

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
  const { searchQuery, setSearchQuery, viewArchived } = useIdeaBoxContext()

  return (
    <ModuleWrapper>
      <ContainerHeader />
      {!viewArchived && (
        <SearchInput
          namespace="modules.ideaBox"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          stuffToSearch={path === '' ? 'idea' : 'idea In Folder'}
        />
      )}
      <TagsSelector />
      <IdeaAndFolderList />
      <FAB />
      <ModifyIdeaModal />
      <ModifyFolderModal />
      <ModifyTagModal />
      <DeleteModals />
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
