import { Icon } from '@iconify/react/dist/iconify.js'
import { useWalletStore } from '@modules/wallet/client/stores/useWalletStore'
import clsx from 'clsx'

import numberToCurrency from '../../../utils/numberToCurrency'

function Amount({ amount, className }: { amount: number; className?: string }) {
  const { isAmountHidden } = useWalletStore()

  return (
    <p
      className={clsx(
        'flex text-5xl font-medium',
        isAmountHidden ? 'items-center' : 'items-end',
        className
      )}
    >
      <span className="text-bg-500 mr-2 text-3xl">RM</span>
      {isAmountHidden ? (
        <span className="flex items-center">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Icon key={i} className="size-8" icon="uil:asterisk" />
            ))}
        </span>
      ) : (
        <span className="truncate">{numberToCurrency(amount)}</span>
      )}
    </p>
  )
}

export default Amount
