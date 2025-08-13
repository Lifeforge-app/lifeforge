import {
  ContextMenuItem,
  ContextMenuSelectorWrapper,
  SidebarDivider
} from 'lifeforge-ui'
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
        <ContextMenuSelectorWrapper
          icon="tabler:sort-ascending"
          title={t('hamburgerMenu.sortBy')}
        >
          {SORT_TYPE.map(([icon, id]) => (
            <ContextMenuItem
              key={id}
              icon={icon}
              isToggled={sortType === id}
              namespace="apps.scoresLibrary"
              text={t(`sortTypes.${id}`)}
              onClick={() => {
                setSortType(id)
              }}
            />
          ))}
        </ContextMenuSelectorWrapper>
        <SidebarDivider noMargin />
        <ContextMenuSelectorWrapper
          icon="tabler:eye"
          title={t('hamburgerMenu.viewAs')}
        >
          {['grid', 'list'].map(type => (
            <ContextMenuItem
              key={type}
              icon={type === 'grid' ? 'uil:apps' : 'uil:list-ul'}
              isToggled={view === type}
              text={t(`viewTypes.${type}`)}
              onClick={() => {
                setView(type as 'grid' | 'list')
              }}
            />
          ))}
        </ContextMenuSelectorWrapper>
      </div>
    </>
  )
}

export default ActionMenu
