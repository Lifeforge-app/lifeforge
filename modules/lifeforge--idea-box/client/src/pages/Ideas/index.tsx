import { useParams } from 'react-router'

import { SearchInput } from '@lifeforge/ui'

import IdeaBoxProvider, { useIdeaBoxContext } from '@/providers/IdeaBoxProvider'

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
          debounceMs={300}
          searchTarget={path === '' ? 'idea' : 'idea In Folder'}
          value={searchQuery}
          onChange={setSearchQuery}
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
