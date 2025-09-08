import { SearchInput } from 'lifeforge-ui'
import { useParams } from 'react-router'

import IdeaBoxProvider, {
  useIdeaBoxContext
} from '@apps/01.Productivity/ideaBox/providers/IdeaBoxProvider'

import FAB from './components/FAB'
import Header from './components/Header'
import IdeaAndFolderList from './components/IdeaAndFolderList'
import TagsSelector from './components/TagsSelector'

function Ideas() {
  const { '*': path } = useParams<{ '*': string }>()

  const { searchQuery, setSearchQuery, viewArchived } = useIdeaBoxContext()

  return (
    <>
      <Header />
      {!viewArchived && (
        <SearchInput
          className="mt-4"
          namespace="apps.ideaBox"
          searchTarget={path === '' ? 'idea' : 'idea In Folder'}
          setValue={setSearchQuery}
          value={searchQuery}
        />
      )}
      <TagsSelector />
      <IdeaAndFolderList />
      <FAB />
    </>
  )
}

const IdeasWithProvider = () => {
  return (
    <IdeaBoxProvider>
      <Ideas />
    </IdeaBoxProvider>
  )
}

export default IdeasWithProvider
