import useFilter from '@/hooks/useFilter'
import { SidebarDivider, SidebarItem, SidebarWrapper } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import CategoriesSection from './components/CategoriesSection'
import DifficultiesSection from './components/DifficultiesSection'

function Sidebar() {
  const { t } = useTranslation('apps.achievements')

  const { updateFilter, filter } = useFilter()

  return (
    <SidebarWrapper>
      <SidebarItem
        active={!filter.category && !filter.difficulty}
        icon="tabler:award"
        label={t('headers.all')}
        onClick={() => {
          updateFilter('category', null)
          updateFilter('difficulty', null)
        }}
      />
      <SidebarItem
        active={false}
        icon="tabler:star"
        label={t('sidebar.starredAchievements')}
        onClick={() => {}}
      />
      <SidebarDivider />
      <DifficultiesSection />
      <SidebarDivider />
      <CategoriesSection />
    </SidebarWrapper>
  )
}

export default Sidebar
