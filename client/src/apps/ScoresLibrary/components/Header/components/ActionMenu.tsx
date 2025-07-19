import {
  HamburgerMenuSelectorWrapper,
  MenuItem,
  SidebarDivider
} from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation('apps.scoresLibrary')

  return (
    <>
      <div className="block md:hidden">
        <SidebarDivider noMargin />
        <HamburgerMenuSelectorWrapper
          icon="tabler:sort-ascending"
          title={t('hamburgerMenu.sortBy')}
        >
          {SORT_TYPE.map(([icon, id]) => (
            <MenuItem
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
        </HamburgerMenuSelectorWrapper>
        <SidebarDivider noMargin />
        <HamburgerMenuSelectorWrapper
          icon="tabler:eye"
          title={t('hamburgerMenu.viewAs')}
        >
          {['grid', 'list'].map(type => (
            <MenuItem
              key={type}
              icon={type === 'grid' ? 'uil:apps' : 'uil:list-ul'}
              isToggled={view === type}
              text={t(`viewTypes.${type}`)}
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
