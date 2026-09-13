import { useModuleTranslation } from '@lifeforge/localization'
import { ContextMenu, ContextMenuGroup, ContextMenuItem } from '@lifeforge/ui'

import type { WalletTransaction } from '@/pages/Transactions'

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
  const { t } = useModuleTranslation()

  return (
    <ContextMenu>
      <ContextMenuGroup icon="tabler:eye" label="Toggle view">
        {VIEWS.map(([icon, id]) => (
          <ContextMenuItem
            key={id}
            checked={viewsFilter.includes(id)}
            icon={icon}
            label={t(`transactionTypes.${id}`)}
            onClick={() => {
              toggleView(id)
            }}
          />
        ))}
      </ContextMenuGroup>
    </ContextMenu>
  )
}

export default MiniCalendarToggleViewMenu
