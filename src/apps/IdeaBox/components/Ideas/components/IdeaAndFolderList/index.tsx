import { useTranslation } from 'react-i18next'

import { EmptyStateScreen, QueryWrapper } from '@lifeforge/ui'

import { useIdeaBoxContext } from '@apps/IdeaBox/providers/IdeaBoxProvider'

import FolderList from './components/FolderList'
import IdeaList from './components/IdeaList'

function IdeaAndFolderList() {
  const { t } = useTranslation('apps.ideaBox')
  const {
    entriesQuery,
    foldersQuery,
    searchResultsQuery,
    debouncedSearchQuery,
    selectedTags,
    viewArchived,
    setModifyIdeaModalOpenType
  } = useIdeaBoxContext()

  return (
    <div className="mb-20 mt-6">
      {debouncedSearchQuery.trim().length === 0 && selectedTags.length === 0 ? (
        <QueryWrapper query={entriesQuery}>
          {data => (
            <QueryWrapper query={foldersQuery}>
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
            </QueryWrapper>
          )}
        </QueryWrapper>
      ) : (
        <QueryWrapper query={searchResultsQuery}>
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
        </QueryWrapper>
      )}
    </div>
  )
}

export default IdeaAndFolderList
