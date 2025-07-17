import { t } from 'i18next'

import {
  HamburgerMenuSelectorWrapper,
  MenuItem,
  SidebarDivider
} from '@lifeforge/ui'

const SORT_TYPE = [
  ['tabler:clock', 'newest'],
  ['tabler:clock', 'oldest'],
  ['tabler:at', 'author'],
  ['tabler:abc', 'name']
]

function ActionMenu({
  setView,
  view,
  sortType,
  setSortType
}: {
  setView: (view: 'grid' | 'list') => void
  view: 'grid' | 'list'
  sortType: string
  setSortType: React.Dispatch<React.SetStateAction<string>>
}) {
  return (
    <>
      <div className="block md:hidden">
        <SidebarDivider noMargin />
        <HamburgerMenuSelectorWrapper
          icon="tabler:sort-ascending"
          title="Sort by"
        >
          {SORT_TYPE.map(([icon, id]) => (
            <MenuItem
              key={id}
              icon={icon}
              isToggled={sortType === id}
              text={t(`sortTypes.${id}`)}
              onClick={() => {
                setSortType(id)
              }}
            />
          ))}
        </HamburgerMenuSelectorWrapper>
        <SidebarDivider noMargin />
        <HamburgerMenuSelectorWrapper icon="tabler:eye" title="View as">
          {['grid', 'list'].map(type => (
            <MenuItem
              key={type}
              icon={type === 'grid' ? 'uil:apps' : 'uil:list-ul'}
              isToggled={view === type}
              text={type.charAt(0).toUpperCase() + type.slice(1)}
              onClick={() => {
                setView(type as 'grid' | 'list')
              }}
            />
          ))}
        </HamburgerMenuSelectorWrapper>
      </div>
    </>
  )
}

export default ActionMenu
