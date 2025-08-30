import { SidebarDivider, SidebarWrapper } from 'lifeforge-ui'

import CalendarList from './components/CalendarList'
import CategoryList from './components/CategoryList'
import MiniCalendar from './components/MiniCalendar'

function Sidebar({
  selectedCalendar,
  setSelectedCalendar,
  selectedCategory,
  setSelectedCategory
}: {
  selectedCalendar: string | null
  setSelectedCalendar: React.Dispatch<React.SetStateAction<string | null>>
  selectedCategory: string | null
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>
}) {
  return (
    <SidebarWrapper>
      <MiniCalendar />
      <SidebarDivider />
      <CalendarList
        selectedCalendar={selectedCalendar}
        setSelectedCalendar={setSelectedCalendar}
      />
      <SidebarDivider />
      <CategoryList
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
    </SidebarWrapper>
  )
}

export default Sidebar
