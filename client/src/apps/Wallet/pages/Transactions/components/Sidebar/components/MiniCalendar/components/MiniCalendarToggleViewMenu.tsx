import {
  HamburgerMenu,
  HamburgerMenuSelectorWrapper,
  MenuItem
} from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import { IWalletTransaction } from '@apps/Wallet/pages/Transactions'

const VIEWS = [
  ['tabler:login-2', 'income'],
  ['tabler:logout', 'expenses'],
  ['tabler:transfer', 'transfer']
] as const

function MiniCalendarToggleViewMenu({
  viewsFilter,
  toggleView
}: {
  viewsFilter: IWalletTransaction['type'][]
  toggleView: (view: IWalletTransaction['type']) => void
}) {
  const { t } = useTranslation('apps.wallet')

  return (
    <HamburgerMenu>
      <HamburgerMenuSelectorWrapper icon="tabler:eye" title="Toggle view">
        {VIEWS.map(([icon, id]) => (
          <MenuItem
            key={id}
            icon={icon}
            isToggled={viewsFilter.includes(id)}
            namespace={false}
            text={t(`transactionTypes.${id}`)}
            onClick={e => {
              e.preventDefault()
              toggleView(id)
            }}
          />
        ))}
      </HamburgerMenuSelectorWrapper>
    </HamburgerMenu>
  )
}

export default MiniCalendarToggleViewMenu
