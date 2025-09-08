import { Icon } from '@iconify/react'
import clsx from 'clsx'

import { useWalletStore } from '@apps/03.Finance/Wallet/stores/useWalletStore'

function CategoriesSectionItemIcon({
  icon,
  type,
  id
}: {
  icon: string
  type: 'income' | 'expenses' | null
  id: string | null
}) {
  const { selectedCategory } = useWalletStore()

  return (
    <div className="relative flex size-7 items-center justify-center">
      <Icon
        className={clsx(
          'size-6 shrink-0',
          selectedCategory === id && 'text-custom-500'
        )}
        icon={icon}
      />
      <Icon
        className={clsx(
          'absolute -right-2 -bottom-2 size-4 shrink-0',
          type
            ? {
                income: 'text-green-500',
                expenses: 'text-red-500'
              }[type]
            : 'text-yellow-500'
        )}
        icon={
          type
            ? {
                income: 'tabler:login-2',
                expenses: 'tabler:logout'
              }[type]
            : 'tabler:arrow-bar-both'
        }
      />
    </div>
  )
}

export default CategoriesSectionItemIcon
