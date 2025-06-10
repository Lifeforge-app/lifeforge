import { useDebounce } from '@uidotdev/usehooks'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Button,
  EmptyStateScreen,
  FAB,
  ModuleHeader,
  ModuleWrapper,
  QueryWrapper,
  SearchInput
} from '@lifeforge/ui'
import { useModalsEffect } from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

import useAPIQuery from '@hooks/useAPIQuery'

import { type IWishlistList } from '../../interfaces/wishlist_interfaces'
import WishlistListItem from './components/WishlistListItem'
import { wishlistListsModals } from './modals'

function Wishlist() {
  const open = useModalStore(state => state.open)
  const { t } = useTranslation('apps.wishlist')

  const listsQuery = useAPIQuery<IWishlistList[]>('wishlist/lists', [
    'wishlist',
    'lists'
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 300)

  const filteredLists = useMemo(() => {
    return listsQuery.data?.filter(list =>
      list.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    )
  }, [listsQuery.data, debouncedSearchQuery])

  const handleCreateWishlistList = useCallback(() => {
    open('wishlist.lists.modifyWishlistList', {
      type: 'create',
      existedData: null
    })
  }, [])

  useModalsEffect(wishlistListsModals)

  return (
    <ModuleWrapper>
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
        icon="tabler:heart"
        title="Wishlist"
      />
      <SearchInput
        className="mt-6!"
        namespace="apps.wishlist"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        stuffToSearch="wishlist"
      />
      <QueryWrapper query={listsQuery}>
        {lists =>
          (() => {
            if (!lists.length) {
              return (
                <EmptyStateScreen
                  icon="tabler:box-off"
                  name="wishlists"
                  namespace="apps.wishlist"
                />
              )
            }

            if (!filteredLists?.length) {
              return (
                <EmptyStateScreen
                  icon="tabler:search-off"
                  name="search"
                  namespace="apps.wishlist"
                />
              )
            }
            return (
              <div className="mt-6 mb-14 grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(24rem,1fr))]">
                {filteredLists.map(list => (
                  <WishlistListItem key={list.id} list={list} />
                ))}
              </div>
            )
          })()
        }
      </QueryWrapper>
      <FAB
        hideWhen="md"
        icon="tabler:plus"
        onClick={handleCreateWishlistList}
      />
    </ModuleWrapper>
  )
}

export default Wishlist
