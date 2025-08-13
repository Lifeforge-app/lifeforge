import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuSelectorWrapper
} from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import type { WalletTransaction } from '@apps/Wallet/pages/Transactions'

const VIEWS = [
  ['tabler:login-2', 'income'],
  ['tabler:logout', 'expenses'],
  ['tabler:transfer', 'transfer']
] as const

function MiniCalendarToggleViewMenu({
  viewsFilter,
  toggleView
}: {
  viewsFilter: WalletTransaction['type'][]
  toggleView: (view: WalletTransaction['type']) => void
}) {
  const { t } = useTranslation('apps.wallet')

  return (
    <ContextMenu>
      <ContextMenuSelectorWrapper icon="tabler:eye" title="Toggle view">
        {VIEWS.map(([icon, id]) => (
          <ContextMenuItem
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
      </ContextMenuSelectorWrapper>
    </ContextMenu>
  )
}

export default MiniCalendarToggleViewMenu
