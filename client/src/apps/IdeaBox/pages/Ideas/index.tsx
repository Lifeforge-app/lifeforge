import { ModuleWrapper, SearchInput } from 'lifeforge-ui'
import { useParams } from 'react-router'

import { useIdeaBoxContext } from '@apps/IdeaBox/providers/IdeaBoxProvider'

import FAB from './components/FAB'
import Header from './components/Header'
import IdeaAndFolderList from './components/IdeaAndFolderList'
import TagsSelector from './components/TagsSelector'

function Ideas() {
  const { '*': path } = useParams<{ '*': string }>()
  const { searchQuery, setSearchQuery, viewArchived } = useIdeaBoxContext()

  return (
    <ModuleWrapper>
      <Header />
      {!viewArchived && (
        <SearchInput
          className="mt-4"
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
