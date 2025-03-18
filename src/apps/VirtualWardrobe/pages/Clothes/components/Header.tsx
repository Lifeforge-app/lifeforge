import VW_CATEGORIES from '@apps/VirtualWardrobe/constants/virtual_wardrobe_categories'
import VW_COLORS from '@apps/VirtualWardrobe/constants/virtual_wardrobe_colors'
import {
  IVirtualWardrobeEntry,
  IVirtualWardrobeSidebarData
} from '@apps/VirtualWardrobe/interfaces/virtual_wardrobe_interfaces'
import { Icon } from '@iconify/react'
import { UseQueryResult } from '@tanstack/react-query'

import { HeaderFilter } from '@lifeforge/ui'

function Header({
  entriesQuery,
  sidebarDataQuery,
  setSidebarOpen
}: {
  entriesQuery: UseQueryResult<IVirtualWardrobeEntry[]>
  sidebarDataQuery: UseQueryResult<IVirtualWardrobeSidebarData>
  setSidebarOpen: (open: boolean) => void
}) {
  return (
    <header className="flex-between flex w-full">
      <div>
        <div className="flex min-w-0 items-end">
          <h1 className="truncate text-3xl font-semibold sm:text-4xl">
            All Clothes
          </h1>
          <span className="text-bg-500 ml-2 mr-8 text-base">
            ({entriesQuery.isSuccess ? entriesQuery.data.length : 0})
          </span>
        </div>
        {sidebarDataQuery.isSuccess && sidebarDataQuery.data && (
          <HeaderFilter
            items={{
              category: {
                data: Object.keys(sidebarDataQuery.data.categories).map(
                  cat => ({
                    id: cat,
                    name: cat,
                    icon: VW_CATEGORIES.find(c => c.name === cat)?.icon ?? ''
                  })
                )
              },
              subcategory: {
                data: Object.keys(sidebarDataQuery.data.subcategories).map(
                  sub => ({
                    id: sub,
                    name: sub
                  })
                )
              },
              brand: {
                data: Object.keys(sidebarDataQuery.data.brands).map(brand => ({
                  id: brand === '' ? 'unknown' : brand,
                  name: brand === '' ? 'Unknown' : brand,
                  icon: 'tabler:tag'
                }))
              },
              size: {
                data: Object.keys(sidebarDataQuery.data.sizes).map(size => ({
                  id: size,
                  name: size,
                  icon: 'tabler:ruler'
                }))
              },
              color: {
                data: Object.keys(sidebarDataQuery.data.colors).map(color => ({
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
        className="text-bg-500 hover:bg-bg-200 dark:hover:bg-bg-800 dark:hover:text-bg-50 -ml-4 rounded-lg p-4 transition-all lg:hidden"
        onClick={() => {
          setSidebarOpen(true)
        }}
      >
        <Icon className="text-2xl" icon="tabler:menu" />
      </button>
    </header>
  )
}

export default Header
