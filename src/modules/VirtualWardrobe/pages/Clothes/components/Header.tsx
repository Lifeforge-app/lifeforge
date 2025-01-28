import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import HeaderFilter from '@components/utilities/HeaderFilter'
import VW_CATEGORIES from '@constants/virtual_wardrobe_categories'
import VW_COLORS from '@constants/virtual_wardrobe_colors'
import { Loadable } from '@interfaces/common'
import {
  IVirtualWardrobeEntry,
  IVirtualWardrobeSidebarData
} from '@interfaces/virtual_wardrobe_interfaces'

function Header({
  entries,
  sidebarData,
  setSidebarOpen
}: {
  entries: Loadable<IVirtualWardrobeEntry[]>
  sidebarData: Loadable<IVirtualWardrobeSidebarData>
  setSidebarOpen: (open: boolean) => void
}): React.ReactElement {
  return (
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
            items={{
              category: {
                data: Object.keys(sidebarData.categories).map(cat => ({
                  id: cat,
                  name: cat,
                  icon: VW_CATEGORIES.find(c => c.name === cat)?.icon ?? ''
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
  )
}

export default Header
