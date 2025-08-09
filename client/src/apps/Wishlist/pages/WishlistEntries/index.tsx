import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import forgeAPI from '@utils/forgeAPI'
import {
  Button,
  MenuItem,
  ModuleWrapper,
  QueryWrapper,
  SearchInput,
  Tabs
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify'
import type { InferOutput } from 'shared'

import EntryList from './components/EntryList'
import Header from './components/Header'
import FromOtherAppsModal from './modals/FromOtherAppsModal'
import ModifyEntryModal from './modals/ModifyEntryModal'

export type WishlistEntry = InferOutput<
  typeof forgeAPI.wishlist.entries.listByListId
>[number]

export type WishlistList = InferOutput<typeof forgeAPI.wishlist.lists.getById>

function WishlistEntries() {
  const open = useModalStore(state => state.open)

  const navigate = useNavigate()

  const { t } = useTranslation('apps.wishlist')

  const { id } = useParams<{ id: string }>()

  const [activeTab, setActiveTab] = useState('wishlist')

  const validQuery = useQuery(
    forgeAPI.wishlist.lists.validate
      .input({
        id: id ?? ''
      })
      .queryOptions()
  )

  const wishlistListDetailsQuery = useQuery(
    forgeAPI.wishlist.lists.getById
      .input({
        id: id ?? ''
      })
      .queryOptions({
        enabled: validQuery.data === true
      })
  )

  const entriesQuery = useQuery(
    forgeAPI.wishlist.entries.listByListId
      .input({
        id: id ?? '',
        bought: activeTab === 'bought'
      })
      .queryOptions()
  )

  const [searchQuery, setSearchQuery] = useState('')

  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 300)

  const filteredEntries = useMemo(() => {
    return entriesQuery.data?.filter(entry =>
      entry.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    )
  }, [entriesQuery.data, debouncedSearchQuery])

  const handleAddManually = useCallback(() => {
    open(ModifyEntryModal, {
      type: 'create',
      initialData: {
        list: id as string
      }
    })
  }, [id])

  const handleAddFromOtherApps = useCallback(() => {
    open(FromOtherAppsModal, {})
  }, [])

  useEffect(() => {
    if (typeof validQuery.data === 'boolean' && !validQuery.data) {
      toast.error('Invalid ID')
      navigate('/wishlist')
    }
  }, [validQuery.data])

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
                    enabled={['wishlist', 'bought']}
                    items={[
                      {
                        id: 'wishlist',
                        name: t('tabs.wishlist'),
                        icon: 'tabler:heart',
                        amount:
                          activeTab === 'wishlist'
                            ? entries.length
                            : wishlistListDetails.total_count - entries.length
                      },
                      {
                        id: 'bought',
                        name: t('tabs.bought'),
                        icon: 'tabler:check',
                        amount:
                          activeTab === 'bought'
                            ? entries.length
                            : wishlistListDetails.bought_count
                      }
                    ]}
                    onNavClick={setActiveTab}
                  />
                  <SearchInput
                    className="mt-0! mb-6"
                    namespace="apps.wishlist"
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    stuffToSearch="entry"
                  />
                  <EntryList
                    filteredEntries={filteredEntries || []}
                    isTotallyEmpty={(entriesQuery.data?.length ?? 0) === 0}
                  />
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
