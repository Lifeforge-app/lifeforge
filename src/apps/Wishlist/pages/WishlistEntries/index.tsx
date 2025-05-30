import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify'

import {
  Button,
  EmptyStateScreen,
  MenuItem,
  ModuleWrapper,
  QueryWrapper,
  Scrollbar,
  Tabs
} from '@lifeforge/ui'
import { useModalsEffect } from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

import useAPIQuery from '@hooks/useAPIQuery'

import {
  IWishlistEntry,
  IWishlistList
} from '../../interfaces/wishlist_interfaces'
import EntryItem from './components/EntryItem'
import Header from './components/Header'
import { wishlistEntriesModals } from './modals'

function WishlistEntries() {
  const open = useModalStore(state => state.open)
  const { t } = useTranslation('apps.wishlist')
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const validQuery = useAPIQuery<boolean>(`wishlist/lists/valid/${id}`, [
    `wishlist`,
    `lists`,
    `valid`,
    id
  ])
  const [activeTab, setActiveTab] = useState('wishlist')
  const wishlistListDetailsQuery = useAPIQuery<IWishlistList>(
    `wishlist/lists/${id}`,
    [`wishlist`, `lists`, id],
    validQuery.data === true
  )
  const queryKey = useMemo(
    () => [`wishlist`, `entries`, id, activeTab === 'bought'],
    [id, activeTab]
  )
  const entriesQuery = useAPIQuery<IWishlistEntry[]>(
    `wishlist/entries/${id}?bought=${activeTab === 'bought'}`,
    queryKey,
    validQuery.data === true
  )

  const handleAddManually = useCallback(() => {
    open('wishlist.entries.modifyEntry', {
      type: 'create',
      existedData: {
        list: id as string
      },
      queryKey
    })
  }, [id])

  const handleAddFromOtherApps = useCallback(() => {
    open('wishlist.entries.fromOtherApps', {})
  }, [])

  useEffect(() => {
    if (typeof validQuery.data === 'boolean' && !validQuery.data) {
      toast.error('Invalid ID')
      navigate('/wishlist')
    }
  }, [validQuery.data])

  useModalsEffect(wishlistEntriesModals)

  return (
    <ModuleWrapper>
      <QueryWrapper query={wishlistListDetailsQuery}>
        {wishlistListDetails => (
          <>
            <Header wishlistListDetails={wishlistListDetails} />
            <QueryWrapper query={entriesQuery}>
              {entries => (
                <>
                  <Tabs
                    active={activeTab}
                    className="mt-6"
                    enabled={['wishlist', 'bought']}
                    items={[
                      {
                        id: 'wishlist',
                        name: t('tabs.wishlist'),
                        icon: 'tabler:heart',
                        amount: (() => {
                          if (
                            typeof entries === 'string' ||
                            typeof wishlistListDetails === 'string'
                          ) {
                            return 0
                          }

                          return activeTab === 'wishlist'
                            ? entries.length
                            : wishlistListDetails.item_count - entries.length
                        })()
                      },
                      {
                        id: 'bought',
                        name: t('tabs.bought'),
                        icon: 'tabler:check',
                        amount: (() => {
                          if (
                            typeof entries === 'string' ||
                            typeof wishlistListDetails === 'string'
                          ) {
                            return 0
                          }

                          return activeTab === 'bought'
                            ? entries.length
                            : wishlistListDetails.item_count - entries.length
                        })()
                      }
                    ]}
                    onNavClick={setActiveTab}
                  />
                  {entries.length === 0 ? (
                    <EmptyStateScreen
                      ctaContent="new"
                      ctaTProps={{
                        item: t('items.entry')
                      }}
                      icon="tabler:shopping-cart-off"
                      name="entries"
                      namespace="apps.wishlist"
                    />
                  ) : (
                    <Scrollbar>
                      <ul className="mb-14 flex flex-col space-y-2 sm:mb-6">
                        {entries.map(entry => (
                          <EntryItem
                            key={entry.id}
                            entry={entry}
                            queryKey={queryKey}
                          />
                        ))}
                      </ul>
                    </Scrollbar>
                  )}
                </>
              )}
            </QueryWrapper>
          </>
        )}
      </QueryWrapper>
      <Menu as="div" className="absolute right-6 bottom-6 z-50 block md:hidden">
        <Button as={MenuButton} icon="tabler:plus" onClick={() => {}} />
        <MenuItems
          transition
          anchor="top end"
          className="bg-bg-100 dark:bg-bg-800 overflow-hidden overscroll-contain rounded-md shadow-lg outline-hidden transition duration-100 ease-out [--anchor-gap:8px] focus:outline-hidden data-closed:scale-95 data-closed:opacity-0"
        >
          <MenuItem
            icon="tabler:plus"
            namespace="apps.wishlist"
            text="Add Manually"
            onClick={handleAddManually}
          />
          <MenuItem
            icon="tabler:apps"
            namespace="apps.wishlist"
            text="From Other Apps"
            onClick={handleAddFromOtherApps}
          />
        </MenuItems>
      </Menu>
    </ModuleWrapper>
  )
}

export default WishlistEntries
