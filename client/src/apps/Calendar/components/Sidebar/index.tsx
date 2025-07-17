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
  selectedCalendar: string | undefined
  setSelectedCalendar: React.Dispatch<React.SetStateAction<string | undefined>>
  selectedCategory: string | undefined
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | undefined>>
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
