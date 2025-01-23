import { Icon } from '@iconify/react/dist/iconify.js'
import { useDebounce } from '@uidotdev/usehooks'
import React, { useState } from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
import HeaderFilter from '@components/Miscellaneous/HeaderFilter'
import Scrollbar from '@components/Miscellaneous/Scrollbar'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIFallbackComponent from '@components/Screens/APIComponentWithFallback'
import VW_CATEGORIES from '@constants/virtual_wardrobe_categories'
import VW_COLORS from '@constants/virtual_wardrobe_colors'
import useFetch from '@hooks/useFetch'
import useHashParams from '@hooks/useHashParams'
import {
  type IVirtualWardrobeSidebarData,
  type IVirtualWardrobeEntry
} from '@interfaces/virtual_wardrobe_interfaces'
import EntryItem from './components/EntryItem'
import ModifyItemModal from './components/ModifyItemModal'
import Sidebar from './components/Sidebar'

function VirtualWardrobeClothes(): React.ReactElement {
  const [searchParams, setSearchParams] = useHashParams()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const [modifyItemModalOpenType, setModifyItemModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [deleteItemConfirmModalOpen, setDeleteItemConfirmModalOpen] =
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
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ModuleWrapper>
      <ModuleHeader
        title="Virtual Wardrobe"
        icon="tabler:shirt"
        actionButton={
          <Button
            icon="tabler:plus"
            onClick={() => {
              setModifyItemModalOpenType('create')
            }}
          >
            Add Item
          </Button>
        }
      />
      <div className="mt-6 flex min-h-0 w-full flex-1">
        <Sidebar
          isOpen={sidebarOpen}
          setOpen={setSidebarOpen}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          sidebarData={sidebarData}
        />
        <div className="flex w-full flex-col lg:ml-8">
          <header className="flex-between flex w-full">
            <div>
              <div className="flex min-w-0 items-end">
                <h1 className="truncate text-3xl font-semibold sm:text-4xl">
                  All Clothes
                </h1>
                <span className="ml-2 mr-8 text-base text-bg-500">
                  ({typeof entries !== 'string' ? entries.length : 0})
                </span>
              </div>
              {typeof sidebarData !== 'string' && (
                <HeaderFilter
                  searchParams={searchParams}
                  setSearchParams={setSearchParams}
                  items={{
                    category: {
                      data: Object.keys(sidebarData.categories).map(cat => ({
                        id: cat,
                        name: cat,
                        icon:
                          VW_CATEGORIES.find(c => c.name === cat)?.icon ?? ''
                      }))
                    },
                    subcategory: {
                      data: Object.keys(sidebarData.subcategories).map(sub => ({
                        id: sub,
                        name: sub
                      }))
                    },
                    brand: {
                      data: Object.keys(sidebarData.brands).map(brand => ({
                        id: brand === '' ? 'unknown' : brand,
                        name: brand === '' ? 'Unknown' : brand,
                        icon: 'tabler:tag'
                      }))
                    },
                    size: {
                      data: Object.keys(sidebarData.sizes).map(size => ({
                        id: size,
                        name: size,
                        icon: 'tabler:ruler'
                      }))
                    },
                    color: {
                      data: Object.keys(sidebarData.colors).map(color => ({
                        id: color,
                        name: color,
                        color: VW_COLORS.find(c => c.name === color)?.hex ?? ''
                      })),
                      isColored: true
                    }
                  }}
                />
              )}
            </div>
            <button
              onClick={() => {
                setSidebarOpen(true)
              }}
              className="-ml-4 rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200 dark:hover:bg-bg-800 dark:hover:text-bg-50 lg:hidden"
            >
              <Icon icon="tabler:menu" className="text-2xl" />
            </button>
          </header>
          <div className="flex gap-2">
            <SearchInput
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              stuffToSearch="clothes"
            />
          </div>
          <APIFallbackComponent data={entries}>
            {entries => (
              <Scrollbar className="mt-6 pb-16">
                <div className="mb-8 grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
                  {entries.map(entry => (
                    <EntryItem
                      key={entry.id}
                      entry={entry}
                      onUpdate={() => {
                        setExistedData(entry)
                        setModifyItemModalOpenType('update')
                      }}
                      onDelete={() => {
                        setExistedData(entry)
                        setDeleteItemConfirmModalOpen(true)
                      }}
                    />
                  ))}
                </div>
              </Scrollbar>
            )}
          </APIFallbackComponent>
        </div>
      </div>
      <ModifyItemModal
        openType={modifyItemModalOpenType}
        onClose={() => {
          setModifyItemModalOpenType(null)
          setExistedData(null)
        }}
        refreshEntries={() => {
          refreshEntries()
          refreshSidebarData()
        }}
        existedData={existedData}
      />
      <DeleteConfirmationModal
        apiEndpoint="virtual-wardrobe/entries"
        data={existedData}
        isOpen={deleteItemConfirmModalOpen}
        onClose={() => {
          setDeleteItemConfirmModalOpen(false)
        }}
        updateDataLists={() => {
          setEntries(prev => {
            if (typeof prev === 'string') return prev
            return prev.filter(e => e.id !== existedData?.id)
          })
          refreshSidebarData()
        }}
        itemName="item"
        nameKey="name"
      />
    </ModuleWrapper>
  )
}

export default VirtualWardrobeClothes
