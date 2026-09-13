import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { useCallback, useMemo, useState } from 'react'

import type { InferOutput } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  EmptyStateScreen,
  FAB,
  ModuleHeader,
  SearchInput,
  WithQuery,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import WishlistListItem from './components/WishlistListItem'
import ModifyWishlistListModal from './modals/ModifyWishlistModal'

export type WishlistList = InferOutput<
  typeof forgeAPI.wishlist.lists.list
>[number]

function Wishlist() {
  const open = useModalStore(state => state.open)
  const { t } = useModuleTranslation()
  const listsQuery = useQuery(forgeAPI.wishlist.lists.list.queryOptions())
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 300)

  const filteredLists = useMemo(() => {
    return listsQuery.data?.filter(list =>
      list.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    )
  }, [listsQuery.data, debouncedSearchQuery])

  const handleCreateWishlistList = useCallback(() => {
    open(ModifyWishlistListModal, {
      type: 'create'
    })
  }, [])

  return (
    <>
      <ModuleHeader
        actionButton={
          <Button
            className="hidden md:flex"
            icon="tabler:plus"
            tProps={{ item: t('items.wishlist') }}
            onClick={handleCreateWishlistList}
          >
            New
          </Button>
        }
      />
      <SearchInput
        namespace="apps.wishlist"
        searchTarget="wishlist"
        value={searchQuery}
        onChange={setSearchQuery}
      />
      <WithQuery query={listsQuery}>
        {lists =>
          (() => {
            if (!lists.length) {
              return (
                <EmptyStateScreen
                  icon="tabler:box-off"
                  message={{
                    id: 'wishlists',
                    namespace: 'apps.wishlist'
                  }}
                />
              )
            }

            if (!filteredLists?.length) {
              return (
                <EmptyStateScreen
                  icon="tabler:search-off"
                  message={{
                    id: 'search',
                    namespace: 'apps.wishlist'
                  }}
                />
              )
            }

            return (
              <div className="mt-6 mb-14 grid grid-cols-1 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(24rem,1fr))]">
                {filteredLists.map(list => (
                  <WishlistListItem key={list.id} list={list} />
                ))}
              </div>
            )
          })()
        }
      </WithQuery>
      <FAB
        icon="tabler:plus"
        visibilityBreakpoint="md"
        onClick={handleCreateWishlistList}
      />
    </>
  )
}

export default Wishlist
