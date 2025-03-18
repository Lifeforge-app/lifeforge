import { useTranslation } from 'react-i18next'

import { APIFallbackComponent, EmptyStateScreen } from '@lifeforge/ui'

import { useIdeaBoxContext } from '@apps/IdeaBox/providers/IdeaBoxProvider'

import FolderList from './components/FolderList'
import IdeaList from './components/IdeaList'

function IdeaAndFolderList() {
  const { t } = useTranslation('apps.ideaBox')
  const {
    entries,
    entriesLoading,
    folders,
    foldersLoading,
    searchResults,
    searchResultsLoading,
    debouncedSearchQuery,
    selectedTags,
    viewArchived,
    setModifyIdeaModalOpenType
  } = useIdeaBoxContext()

  return (
    <div className="mb-20 mt-6">
      {debouncedSearchQuery.trim().length === 0 && selectedTags.length === 0 ? (
        <APIFallbackComponent data={entriesLoading ? 'loading' : entries}>
          {data => (
            <APIFallbackComponent data={foldersLoading ? 'loading' : folders}>
              {folders => (
                <>
                  {data.length === 0 && folders.length === 0 ? (
                    <div className="mt-6">
                      {!viewArchived ? (
                        <EmptyStateScreen
                          ctaContent="new"
                          ctaTProps={{ item: t('items.idea') }}
                          icon="tabler:bulb-off"
                          name="idea"
                          namespace="apps.ideaBox"
                          onCTAClick={setModifyIdeaModalOpenType as any}
                        />
                      ) : (
                        <EmptyStateScreen
                          icon="tabler:archive-off"
                          name="archived"
                          namespace="apps.ideaBox"
                        />
                      )}
                    </div>
                  ) : (
                    <>
                      {folders.length > 0 && !viewArchived && <FolderList />}
                      {data.length > 0 && <IdeaList data={data} />}
                    </>
                  )}
                </>
              )}
            </APIFallbackComponent>
          )}
        </APIFallbackComponent>
      ) : (
        <APIFallbackComponent
          data={searchResultsLoading ? 'loading' : searchResults}
        >
          {searchResults => (
            <>
              {searchResults.length === 0 ? (
                <div className="mt-6">
                  <EmptyStateScreen
                    icon="tabler:search"
                    name="result"
                    namespace="apps.ideaBox"
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
