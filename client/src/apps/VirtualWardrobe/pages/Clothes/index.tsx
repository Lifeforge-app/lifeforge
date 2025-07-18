import { useDebounce } from '@uidotdev/usehooks'
import {
  Button,
  ContentWrapperWithSidebar,
  EmptyStateScreen,
  LayoutWithSidebar,
  ModuleHeader,
  ModuleWrapper,
  QueryWrapper,
  Scrollbar,
  SearchInput
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import { useAPIQuery } from 'shared/lib'

import VW_CATEGORIES from '@apps/VirtualWardrobe/constants/virtual_wardrobe_categories'
import {
  type IVirtualWardrobeEntry,
  type IVirtualWardrobeSidebarData
} from '@apps/VirtualWardrobe/interfaces/virtual_wardrobe_interfaces'

import EntryItem from './components/EntryItem'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ModifyItemModal from './modals/ModifyItemModal'
import SessionCartModal from './modals/SessionCartModal'

function VirtualWardrobeClothes() {
  const open = useModalStore(state => state.open)
  const { t } = useTranslation('apps.virtualWardrobe')
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 300)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const queryKey = [
    'virtual-wardrobe',
    'entries',
    searchParams.toString(),
    debouncedSearchQuery
  ]

  const sidebarDataQuery = useAPIQuery<IVirtualWardrobeSidebarData>(
    'virtual-wardrobe/entries/sidebar-data',
    ['virtual-wardrobe', 'sidebar-data']
  )
  const entriesQuery = useAPIQuery<IVirtualWardrobeEntry[]>(
    `virtual-wardrobe/entries?${searchParams.toString()}&q=${debouncedSearchQuery}`,
    queryKey
  )
  const sessionCartItemsQuery = useAPIQuery<IVirtualWardrobeEntry[]>(
    'virtual-wardrobe/session',
    ['virtual-wardrobe', 'session-cart-items']
  )

  const handleOpenSessionCart = useCallback(() => {
    open(SessionCartModal, {
      cartItems: sessionCartItemsQuery.data ?? [],
      queryKey
    })
  }, [sessionCartItemsQuery.data, queryKey])

  const handleCreateItem = useCallback(() => {
    open(ModifyItemModal, {
      type: 'create',
      existedData: null
    })
  }, [queryKey])

  return (
    <ModuleWrapper>
      <ModuleHeader
        actionButton={
          <>
            {sessionCartItemsQuery.isSuccess && (
              <Button
                icon="tabler:shopping-bag"
                variant="plain"
                onClick={handleOpenSessionCart}
              >
                {sessionCartItemsQuery.data.length !== 0 && (
                  <>({sessionCartItemsQuery.data.length})</>
                )}
              </Button>
            )}
            <Button
              icon="tabler:plus"
              tProps={{
                item: t('items.clothes')
              }}
              onClick={handleCreateItem}
            >
              new
            </Button>
          </>
        }
        icon="tabler:shirt"
        title="Virtual Wardrobe"
      />
      <LayoutWithSidebar>
        <Sidebar
          isOpen={sidebarOpen}
          setOpen={setSidebarOpen}
          sidebarDataQuery={sidebarDataQuery}
        />
        <ContentWrapperWithSidebar>
          <Header
            entriesQuery={entriesQuery}
            setSidebarOpen={setSidebarOpen}
            sidebarDataQuery={sidebarDataQuery}
          />
          <div className="flex gap-2">
            <SearchInput
              namespace="apps.virtualWardrobe"
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              stuffToSearch="clothes"
            />
          </div>
          <QueryWrapper query={entriesQuery}>
            {entries => {
              if (entries.length === 0) {
                if (
                  debouncedSearchQuery.trim() === '' &&
                  searchParams.toString() === ''
                ) {
                  return (
                    <EmptyStateScreen
                      icon="tabler:shirt-off"
                      name="clothes"
                      namespace="apps.virtualWardrobe"
                    />
                  )
                }

                return (
                  <EmptyStateScreen
                    icon="tabler:search-off"
                    name="results"
                    namespace="apps.virtualWardrobe"
                  />
                )
              }

              return (
                <Scrollbar className="mt-6 pb-16">
                  <ul className="mb-8 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
                    {entries
                      .sort((a, b) => {
                        const catA = VW_CATEGORIES.findIndex(
                          cat => cat.name === a.category
                        )
                        const catB = VW_CATEGORIES.findIndex(
                          cat => cat.name === b.category
                        )

                        if (catA !== catB) return catA - catB

                        const subCatA = VW_CATEGORIES[
                          catA
                        ].subcategories.findIndex(
                          subCat => subCat === a.subcategory
                        )
                        const subCatB = VW_CATEGORIES[
                          catB
                        ].subcategories.findIndex(
                          subCat => subCat === b.subcategory
                        )

                        if (subCatA !== subCatB) return subCatA - subCatB

                        return a.name.localeCompare(b.name)
                      })
                      .map(entry => (
                        <EntryItem
                          key={entry.id}
                          entry={entry}
                          isInCart={
                            !!sessionCartItemsQuery.data?.some(
                              cartItem => cartItem.id === entry.id
                            )
                          }
                          queryKey={queryKey}
                        />
                      ))}
                  </ul>
                </Scrollbar>
              )
            }}
          </QueryWrapper>
        </ContentWrapperWithSidebar>
      </LayoutWithSidebar>
    </ModuleWrapper>
  )
}

export default VirtualWardrobeClothes
