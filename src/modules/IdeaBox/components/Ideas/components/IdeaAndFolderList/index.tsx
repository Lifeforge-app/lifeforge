import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import { useIdeaBoxContext } from '@providers/IdeaBoxProvider'
import FolderList from './components/FolderList'
import IdeaList from './components/IdeaList'

function IdeaAndFolderList(): React.ReactElement {
  const { t } = useTranslation('modules.ideaBox')
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
                            icon="tabler:bulb-off"
                            ctaContent="new"
                            namespace="modules.ideaBox"
                            name="idea"
                            ctaTProps={{ item: t('items.idea') }}
                          />
                        ) : (
                          <EmptyStateScreen
                            namespace="modules.ideaBox"
                            name="archived"
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
                    icon="tabler:search"
                    namespace="modules.ideaBox"
                    name="result"
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
