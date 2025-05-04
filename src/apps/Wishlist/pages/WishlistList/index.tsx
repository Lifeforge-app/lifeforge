import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Button,
  EmptyStateScreen,
  FAB,
  ModuleHeader,
  ModuleWrapper,
  QueryWrapper
} from '@lifeforge/ui'

import useAPIQuery from '@hooks/useAPIQuery'

import { useModalStore } from '../../../../core/modals/useModalStore'
import useModalsEffect from '../../../../core/modals/useModalsEffect'
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
      <QueryWrapper query={listsQuery}>
        {lists =>
          lists.length ? (
            <div className="mt-6 mb-14 grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(24rem,1fr))]">
              {lists.map(list => (
                <WishlistListItem key={list.id} list={list} />
              ))}
            </div>
          ) : (
            <EmptyStateScreen
              icon="tabler:box-off"
              name="wishlists"
              namespace="apps.wishlist"
            />
          )
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
