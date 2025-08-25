import { ContextMenuGroup, ContextMenuItem, SidebarDivider } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import useFilter from '@apps/ScoresLibrary/hooks/useFilter'

const SORT_TYPE = [
  ['tabler:clock', 'newest'],
  ['tabler:clock', 'oldest'],
  ['tabler:at', 'author'],
  ['tabler:abc', 'name']
] as const

function ActionMenu() {
  const { t } = useTranslation('apps.scoresLibrary')

  const { view, sort, updateFilter } = useFilter()

  return (
    <>
      <div className="block md:hidden">
        <SidebarDivider noMargin />
        <ContextMenuGroup
          icon="tabler:sort-ascending"
          label={t('hamburgerMenu.sortBy')}
        >
          {SORT_TYPE.map(([icon, id]) => (
            <ContextMenuItem
              key={id}
              checked={sort === id}
              icon={icon}
              label={t(`sortTypes.${id}`)}
              namespace="apps.scoresLibrary"
              onClick={() => {
                updateFilter('sort', id)
              }}
            />
          ))}
        </ContextMenuGroup>
        <SidebarDivider noMargin />
        <ContextMenuGroup icon="tabler:eye" label={t('hamburgerMenu.viewAs')}>
          {['grid', 'list'].map(type => (
            <ContextMenuItem
              key={type}
              checked={view === type}
              icon={type === 'grid' ? 'uil:apps' : 'uil:list-ul'}
              label={t(`viewTypes.${type}`)}
              onClick={() => {
                updateFilter('view', type as 'grid' | 'list')
              }}
            />
          ))}
        </ContextMenuGroup>
      </div>
    </>
  )
}

export default ActionMenu
