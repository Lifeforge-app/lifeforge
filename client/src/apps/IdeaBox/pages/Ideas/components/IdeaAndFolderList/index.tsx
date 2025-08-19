import { EmptyStateScreen, WithQuery } from 'lifeforge-ui'
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
      initialData: {
        type: 'text'
      }
    })
  }, [])

  return (
    <div className="mt-6 mb-20">
      {debouncedSearchQuery.trim().length === 0 && selectedTags.length === 0 ? (
        <WithQuery query={entriesQuery}>
          {data => (
            <WithQuery query={foldersQuery}>
              {folders => (
                <>
                  {data.length === 0 && folders.length === 0 ? (
                    <div className="mt-6">
                      {!viewArchived ? (
                        <EmptyStateScreen
                          CTAButtonProps={{
                            children: 'new',
                            onClick: handleIdeaCreation,
                            icon: 'tabler:plus',
                            tProps: { item: t('items.idea') }
                          }}
                          icon="tabler:bulb-off"
                          name="idea"
                          namespace="apps.ideaBox"
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
            </WithQuery>
          )}
        </WithQuery>
      ) : (
        <WithQuery query={searchResultsQuery}>
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
        </WithQuery>
      )}
    </div>
  )
}

export default IdeaAndFolderList
