import { UseQueryResult } from '@tanstack/react-query'

import { QueryWrapper, SidebarWrapper } from '@lifeforge/ui'

import { type ICalendarCategory } from '../../interfaces/calendar_interfaces'
import CategoryList from './components/CategoryList'
import MiniCalendar from './components/MiniCalendar'

function Sidebar({
  selectedCategory,
  setSelectedCategory,
  categoriesQuery,
  sidebarOpen,
  setSidebarOpen
}: {
  selectedCategory: string | undefined
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | undefined>>
  categoriesQuery: UseQueryResult<ICalendarCategory[]>
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
}) {
  return (
    <SidebarWrapper isOpen={sidebarOpen} setOpen={setSidebarOpen}>
      <QueryWrapper query={categoriesQuery}>
        {categories => (
          <>
            <MiniCalendar categories={categories} />
            <CategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </>
        )}
      </QueryWrapper>
    </SidebarWrapper>
  )
}

export default Sidebar
