import { useQueryClient } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { toast } from 'react-toastify'

import {
  Button,
  ContentWrapperWithSidebar,
  DeleteConfirmationModal,
  EmptyStateScreen,
  LayoutWithSidebar,
  ModuleHeader,
  ModuleWrapper,
  QueryWrapper,
  Scrollbar,
  SearchInput
} from '@lifeforge/ui'

import VW_CATEGORIES from '@modules/VirtualWardrobe/constants/virtual_wardrobe_categories'
import {
  type IVirtualWardrobeEntry,
  type IVirtualWardrobeSidebarData
} from '@modules/VirtualWardrobe/interfaces/virtual_wardrobe_interfaces'

import useAPIQuery from '@hooks/useAPIQuery'

import fetchAPI from '@utils/fetchAPI'

import SessionCartModal from '../../components/SessionCartModal'
import EntryItem from './components/EntryItem'
import Header from './components/Header'
import ModifyItemModal from './components/ModifyItemModal'
import Sidebar from './components/Sidebar'

function VirtualWardrobeClothes() {
  const { t } = useTranslation('modules.virtualWardrobe')
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 500)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [existedData, setExistedData] = useState<IVirtualWardrobeEntry | null>(
    null
  )

  const [modifyItemModalOpenType, setModifyItemModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [deleteItemConfirmModalOpen, setDeleteItemConfirmModalOpen] =
    useState<boolean>(false)
  const [sessionCartModalOpen, setSessionCartModalOpen] =
    useState<boolean>(false)

  const sidebarDataQuery = useAPIQuery<IVirtualWardrobeSidebarData>(
    'virtual-wardrobe/entries/sidebar-data',
    ['virtual-wardrobe', 'sidebar-data']
  )
  const entriesQuery = useAPIQuery<IVirtualWardrobeEntry[]>(
    `virtual-wardrobe/entries?${searchParams.toString()}&q=${debouncedSearchQuery}`,
    [
      'virtual-wardrobe',
      'entries',
      searchParams.toString(),
      debouncedSearchQuery
    ]
  )
  const sessionCartItemsQuery = useAPIQuery<IVirtualWardrobeEntry[]>(
    'virtual-wardrobe/session',
    ['virtual-wardrobe', 'session-cart-items']
  )

  async function handleAddToCart(entry: IVirtualWardrobeEntry) {
    if (sessionCartItemsQuery.data?.some(item => item.id === entry.id)) {
      toast.info('Item already in cart')
      return
    }

    try {
      await fetchAPI(`virtual-wardrobe/session/${entry.id}`, {
        method: 'POST'
      })

      queryClient.setQueryData<IVirtualWardrobeEntry[]>(
        ['virtual-wardrobe', 'session-cart-items'],
        prev => {
          if (!prev) return prev
          return [...prev, entry]
        }
      )

      toast.success('Item added to cart')
    } catch {
      toast.error('Failed to add item to cart')
    }
  }

  return (
    <ModuleWrapper>
      <ModuleHeader
        actionButton={
          <>
            {sessionCartItemsQuery.isSuccess && (
              <Button
                icon="tabler:shopping-bag"
                variant="plain"
                onClick={() => {
                  setSessionCartModalOpen(true)
                }}
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
              onClick={() => {
                setModifyItemModalOpenType('create')
              }}
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
              namespace="modules.virtualWardrobe"
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
                      namespace="modules.virtualWardrobe"
                    />
                  )
                }

                return (
                  <EmptyStateScreen
                    icon="tabler:search-off"
                    name="results"
                    namespace="modules.virtualWardrobe"
                  />
                )
              }

              return (
                <Scrollbar className="mt-6 pb-16">
                  <ul className="mb-8 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
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
                          onAddToCart={async () => {
                            await handleAddToCart(entry)
                          }}
                          onDelete={() => {
                            setExistedData(entry)
                            setDeleteItemConfirmModalOpen(true)
                          }}
                          onUpdate={() => {
                            setExistedData(entry)
                            setModifyItemModalOpenType('update')
                          }}
                        />
                      ))}
                  </ul>
                </Scrollbar>
              )
            }}
          </QueryWrapper>
        </ContentWrapperWithSidebar>
      </LayoutWithSidebar>
      <ModifyItemModal
        existedData={existedData}
        openType={modifyItemModalOpenType}
        queryKey={[
          'virtual-wardrobe',
          'entries',
          searchParams.toString(),
          debouncedSearchQuery
        ]}
        refreshEntries={() => {
          queryClient.invalidateQueries({
            queryKey: ['virtual-wardrobe', 'sidebar-data']
          })
        }}
        onClose={() => {
          setModifyItemModalOpenType(null)
          setExistedData(null)
        }}
      />
      {sessionCartItemsQuery.isSuccess && (
        <SessionCartModal
          cartItems={sessionCartItemsQuery.data}
          isOpen={sessionCartModalOpen}
          refreshEntries={() => {
            queryClient.invalidateQueries({
              queryKey: [
                'virtual-wardrobe',
                'entries',
                searchParams.toString(),
                debouncedSearchQuery
              ]
            })
          }}
          onClose={() => {
            setSessionCartModalOpen(false)
          }}
        />
      )}

      <DeleteConfirmationModal
        apiEndpoint="virtual-wardrobe/entries"
        data={existedData}
        isOpen={deleteItemConfirmModalOpen}
        itemName="item"
        nameKey="name"
        queryKey={[
          'virtual-wardrobe',
          'entries',
          searchParams.toString(),
          debouncedSearchQuery
        ]}
        updateDataList={() => {
          queryClient.setQueryData<IVirtualWardrobeEntry[]>(
            ['virtual-wardrobe', 'session-cart-items'],
            prev => {
              if (!prev) return prev
              return prev.filter(entry => entry.id !== existedData?.id)
            }
          )
          queryClient.invalidateQueries({
            queryKey: ['virtual-wardrobe', 'sidebar-data']
          })
        }}
        onClose={() => {
          setDeleteItemConfirmModalOpen(false)
        }}
      />
    </ModuleWrapper>
  )
}

export default VirtualWardrobeClothes
