import { EmptyStateScreen, QueryWrapper } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { useIdeaBoxContext } from '@apps/IdeaBox/providers/IdeaBoxProvider'

import ModifyIdeaModal from '../modals/ModifyIdeaModal'
import FolderList from './components/FolderList'
import IdeaList from './components/IdeaList'

function IdeaAndFolderList() {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('apps.ideaBox')

  const {
    entriesQuery,
    foldersQuery,
    searchResultsQuery,
    debouncedSearchQuery,
    selectedTags,
    viewArchived
  } = useIdeaBoxContext()

  const handleIdeaCreation = useCallback(() => {
    open(ModifyIdeaModal, {
      type: 'create',
      ideaType: 'text'
    })
  }, [])

  return (
    <div className="mt-6 mb-20">
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
                          onCTAClick={handleIdeaCreation}
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
