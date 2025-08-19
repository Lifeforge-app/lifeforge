import { SidebarDivider, SidebarWrapper } from 'lifeforge-ui'

import CalendarList from './components/CalendarList'
import CategoryList from './components/CategoryList'
import MiniCalendar from './components/MiniCalendar'

function Sidebar({
  selectedCalendar,
  setSelectedCalendar,
  selectedCategory,
  setSelectedCategory,
  sidebarOpen,
  setSidebarOpen
}: {
  selectedCalendar: string | null
  setSelectedCalendar: React.Dispatch<React.SetStateAction<string | null>>
  selectedCategory: string | null
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
}) {
  return (
    <SidebarWrapper isOpen={sidebarOpen} setOpen={setSidebarOpen}>
      <MiniCalendar />
      <SidebarDivider />
      <CalendarList
        selectedCalendar={selectedCalendar}
        setSelectedCalendar={setSelectedCalendar}
        setSidebarOpen={setSidebarOpen}
      />
      <SidebarDivider />
      <CategoryList
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        setSidebarOpen={setSidebarOpen}
      />
    </SidebarWrapper>
  )
}

export default Sidebar
