import React from 'react'
import { useParams } from 'react-router'
import APIFallbackComponent from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import { useIdeaBoxContext } from '@providers/IdeaBoxProvider'
import FolderList from './components/FolderList'
import IdeaList from './components/IdeaList'

function IdeaAndFolderList(): React.ReactElement {
  const { '*': path } = useParams<{ '*': string }>()
  const {
    entries,
    folders,
    searchResults,
    debouncedSearchQuery,
    selectedTags,
    viewArchived,
    setModifyIdeaModalOpenType
  } = useIdeaBoxContext()

  return (
    <div className="mb-20 mt-6">
      {debouncedSearchQuery.trim().length === 0 &&
      !(path === '' && selectedTags.length > 0) ? (
        <APIFallbackComponent data={entries}>
          {data => (
            <APIFallbackComponent data={folders}>
              {folders => (
                <>
                  {typeof folders !== 'string' &&
                    (data.length === 0 && folders.length === 0 ? (
                      <div className="mt-6">
                        {!viewArchived ? (
                          <EmptyStateScreen
                            onCTAClick={setModifyIdeaModalOpenType as any}
                            title="No ideas yet"
                            description="Hmm... Seems a bit empty here. Consider adding some innovative ideas."
                            icon="tabler:bulb-off"
                            ctaContent="new idea"
                          />
                        ) : (
                          <EmptyStateScreen
                            title="No archived ideas"
                            description="You don't have any archived ideas yet."
                            icon="tabler:archive-off"
                          />
                        )}
                      </div>
                    ) : (
                      <>
                        {folders.length > 0 && !viewArchived && <FolderList />}
                        {data.length > 0 && <IdeaList data={data} />}
                      </>
                    ))}
                </>
              )}
            </APIFallbackComponent>
          )}
        </APIFallbackComponent>
      ) : (
        <APIFallbackComponent data={searchResults}>
          {searchResults => (
            <>
              {searchResults.length === 0 ? (
                <div className="mt-6">
                  <EmptyStateScreen
                    title="No results"
                    description="No ideas found for your search query."
                    icon="tabler:search"
                  />
                </div>
              ) : (
                <IdeaList data={searchResults} />
              )}
            </>
          )}
        </APIFallbackComponent>
      )}
    </div>
  )
}

export default IdeaAndFolderList
