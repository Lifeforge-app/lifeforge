import { useDebounce } from '@uidotdev/usehooks'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { Button } from '@components/buttons'
import { SearchInput } from '@components/inputs'
import ContentWrapperWithSidebar from '@components/layouts/module/ContentWrapperWithSidebar'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import DeleteConfirmationModal from '@components/modals/DeleteConfirmationModal'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import Scrollbar from '@components/utilities/Scrollbar'
import useFetch from '@hooks/useFetch'
import {
  type IVirtualWardrobeSidebarData,
  type IVirtualWardrobeEntry
} from '@interfaces/virtual_wardrobe_interfaces'
import APIRequest from '@utils/fetchData'
import EntryItem from './components/EntryItem'
import Header from './components/Header'
import ModifyItemModal from './components/ModifyItemModal'
import Sidebar from './components/Sidebar'
import SessionCartModal from '../../components/SessionCartModal'

function VirtualWardrobeClothes(): React.ReactElement {
  const { t } = useTranslation('modules.virtualWardrobe')
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 500)

  const [modifyItemModalOpenType, setModifyItemModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [deleteItemConfirmModalOpen, setDeleteItemConfirmModalOpen] =
    useState<boolean>(false)
  const [sessionCartModalOpen, setSessionCartModalOpen] =
    useState<boolean>(false)

  const [existedData, setExistedData] = useState<IVirtualWardrobeEntry | null>(
    null
  )
  const [sidebarData, refreshSidebarData] =
    useFetch<IVirtualWardrobeSidebarData>(
      'virtual-wardrobe/entries/sidebar-data'
    )
  const [entries, refreshEntries, setEntries] = useFetch<
    IVirtualWardrobeEntry[]
  >(
    'virtual-wardrobe/entries?' +
      searchParams.toString() +
      '&q=' +
      debouncedSearchQuery
  )
  const [sessionCartItems, , setSessionCartItems] = useFetch<
    IVirtualWardrobeEntry[]
  >('virtual-wardrobe/session')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  async function handleAddToCart(entry: IVirtualWardrobeEntry): Promise<void> {
    await APIRequest({
      endpoint: `virtual-wardrobe/session/${entry.id}`,
      method: 'POST',
      successInfo: 'add',
      failureInfo: 'add',
      callback: () => {
        setSessionCartItems(prev => {
          if (typeof prev === 'string') return prev
          return [...prev, entry]
        })
      }
    })
  }

  return (
    <ModuleWrapper>
      <ModuleHeader
        actionButton={
          <>
            {typeof sessionCartItems !== 'string' && (
              <Button
                icon="tabler:shopping-bag"
                variant="no-bg"
                onClick={() => {
                  setSessionCartModalOpen(true)
                }}
              >
                {sessionCartItems.length !== 0 && (
                  <>({sessionCartItems.length})</>
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
      <div className="mt-6 flex min-h-0 w-full flex-1">
        <Sidebar
          isOpen={sidebarOpen}
          setOpen={setSidebarOpen}
          sidebarData={sidebarData}
        />
        <ContentWrapperWithSidebar>
          <Header
            entries={entries}
            setSidebarOpen={setSidebarOpen}
            sidebarData={sidebarData}
          />
          <div className="flex gap-2">
            <SearchInput
              namespace="modules.virtualWardrobe"
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              stuffToSearch="clothes"
            />
          </div>
          <APIFallbackComponent data={entries}>
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
                    {entries.map(entry => (
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
          </APIFallbackComponent>
        </ContentWrapperWithSidebar>
      </div>
      <ModifyItemModal
        existedData={existedData}
        openType={modifyItemModalOpenType}
        refreshEntries={() => {
          refreshEntries()
          refreshSidebarData()
        }}
        onClose={() => {
          setModifyItemModalOpenType(null)
          setExistedData(null)
        }}
      />
      <SessionCartModal
        cartItems={sessionCartItems}
        isOpen={sessionCartModalOpen}
        refreshEntries={refreshEntries}
        setCartItems={setSessionCartItems}
        onClose={() => {
          setSessionCartModalOpen(false)
        }}
      />

      <DeleteConfirmationModal
        apiEndpoint="virtual-wardrobe/entries"
        data={existedData}
        isOpen={deleteItemConfirmModalOpen}
        itemName="item"
        nameKey="name"
        updateDataLists={() => {
          setEntries(prev => {
            if (typeof prev === 'string') return prev
            return prev.filter(e => e.id !== existedData?.id)
          })
          refreshSidebarData()
        }}
        onClose={() => {
          setDeleteItemConfirmModalOpen(false)
        }}
      />
    </ModuleWrapper>
  )
}

export default VirtualWardrobeClothes
