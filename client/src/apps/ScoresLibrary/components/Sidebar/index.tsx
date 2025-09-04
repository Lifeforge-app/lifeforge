import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import {
  SidebarDivider,
  SidebarItem,
  SidebarTitle,
  SidebarWrapper,
  WithQuery,
  useModalStore
} from 'lifeforge-ui'
import { useMemo } from 'react'

import useFilter from '@apps/ScoresLibrary/hooks/useFilter'

import ModifyCollectionModal from '../modals/ModifyCollectionModal'
import ModifyTypeModal from '../modals/ModifyTypeModal'
import SidebarAuthorItem from './components/SidebarAuthorItem'
import SidebarTypeItem from './components/SidebarCategoryItem'
import SidebarCollectionItem from './components/SidebarCollectionItem'

function Sidebar() {
  const open = useModalStore(state => state.open)

  const dataQuery = useQuery(
    forgeAPI.scoresLibrary.entries.sidebarData.queryOptions()
  )

  const {
    author,
    starred,
    category: type,
    collection,
    updateFilter
  } = useFilter()

  const collectionsQuery = useQuery(
    forgeAPI.scoresLibrary.collections.list.queryOptions()
  )

  const sortedAuthors = useMemo(
    () =>
      Object.entries(dataQuery.data?.authors ?? {}).sort((a, b) => {
        if (a[1] === b[1]) return a[0].localeCompare(b[0])

        return b[1] - a[1]
      }),
    [dataQuery]
  )

  return (
    <SidebarWrapper>
      <WithQuery query={dataQuery}>
        {sidebarData => (
          <>
            <SidebarItem
              active={[type, author, starred, collection].every(v => !v)}
              icon="tabler:list"
              label="All scores"
              namespace="apps.scoresLibrary"
              number={sidebarData.total}
              onClick={() => {
                updateFilter('category', null)
                updateFilter('collection', null)
                updateFilter('author', null)
                updateFilter('starred', false)
              }}
            />
            <SidebarItem
              active={starred}
              icon="tabler:star-filled"
              label="Starred"
              namespace="apps.scoresLibrary"
              number={sidebarData.favourites}
              onClick={() => {
                updateFilter('starred', true)
              }}
            />
            <SidebarDivider />
            <SidebarTitle
              actionButtonIcon="tabler:plus"
              actionButtonOnClick={() => {
                open(ModifyCollectionModal, {
                  type: 'create'
                })
              }}
              label="collections"
              namespace="apps.scoresLibrary"
            />
            <WithQuery query={collectionsQuery}>
              {collections =>
                collections.length > 0 ? (
                  <>
                    {collections.map(c => (
                      <SidebarCollectionItem
                        key={c.id}
                        data={c}
                        isActive={collection === c.id}
                        onSelect={(collection: string | null) => {
                          updateFilter('collection', collection)
                        }}
                      />
                    ))}
                  </>
                ) : (
                  <p className="text-bg-500 text-center">
                    No collections found
                  </p>
                )
              }
            </WithQuery>
            <SidebarDivider />
            <SidebarTitle
              actionButtonIcon="tabler:plus"
              actionButtonOnClick={() => {
                open(ModifyTypeModal, {
                  openType: 'create'
                })
              }}
              label="categories"
              namespace="apps.scoresLibrary"
            />
            {sidebarData.types.map(t => (
              <SidebarTypeItem key={t.id} data={t} isActive={type === t.id} />
            ))}
            <SidebarDivider />
            <SidebarTitle label="authors" namespace="apps.scoresLibrary" />
            {sortedAuthors.map(([auth, count]) => (
              <SidebarAuthorItem
                key={auth}
                author={auth}
                count={count}
                isActive={(auth || '[na]') === author}
              />
            ))}
          </>
        )}
      </WithQuery>
    </SidebarWrapper>
  )
}

export default Sidebar
