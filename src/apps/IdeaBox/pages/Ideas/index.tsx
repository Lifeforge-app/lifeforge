import { useParams } from 'react-router'

import { ModuleWrapper, SearchInput } from '@lifeforge/ui'

import { useIdeaBoxContext } from '@apps/IdeaBox/providers/IdeaBoxProvider'

import useModalsEffect from '../../../../core/modals/useModalsEffect'
import FAB from './components/FAB'
import Header from './components/Header'
import IdeaAndFolderList from './components/IdeaAndFolderList'
import TagsSelector from './components/TagsSelector'
import { ideaBoxIdeasModals } from './modals'

function Ideas() {
  const { '*': path } = useParams<{ '*': string }>()
  const { searchQuery, setSearchQuery, viewArchived } = useIdeaBoxContext()

  useModalsEffect(ideaBoxIdeasModals)

  return (
    <ModuleWrapper>
      <Header />
      {!viewArchived && (
        <SearchInput
          namespace="apps.ideaBox"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          stuffToSearch={path === '' ? 'idea' : 'idea In Folder'}
        />
      )}
      <TagsSelector />
      <IdeaAndFolderList />
      <FAB />
    </ModuleWrapper>
  )
}

export default Ideas
