import { ContextMenuGroup, ContextMenuItem, SidebarDivider } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import type { ScoreLibrarySortType } from '@apps/ScoresLibrary'

const SORT_TYPE = [
  ['tabler:clock', 'newest'],
  ['tabler:clock', 'oldest'],
  ['tabler:at', 'author'],
  ['tabler:abc', 'name']
] as const

function ActionMenu({
  setView,
  view,
  sortType,
  setSortType
}: {
  setView: (view: 'grid' | 'list') => void
  view: 'grid' | 'list'
  sortType: ScoreLibrarySortType
  setSortType: React.Dispatch<React.SetStateAction<ScoreLibrarySortType>>
}) {
  const { t } = useTranslation('apps.scoresLibrary')

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
              checked={sortType === id}
              icon={icon}
              label={t(`sortTypes.${id}`)}
              namespace="apps.scoresLibrary"
              onClick={() => {
                setSortType(id)
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
                setView(type as 'grid' | 'list')
              }}
            />
          ))}
        </ContextMenuGroup>
      </div>
    </>
  )
}

export default ActionMenu
