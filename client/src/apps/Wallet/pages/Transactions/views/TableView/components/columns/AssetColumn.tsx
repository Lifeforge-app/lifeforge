import { Icon } from '@iconify/react'
import { Link } from 'react-router'

import { type IWalletAsset } from '../../../../../../interfaces/wallet_interfaces'

function AssetColumn({
  asset,
  assets
}: {
  asset: string
  assets: IWalletAsset[]
}) {
  return (
    <td className="p-2 text-center">
      <Link
        className="text-bg-500 dark:text-bg-400! component-bg-lighter inline-flex w-min items-center gap-1 rounded-full px-3 py-1 text-sm whitespace-nowrap"
        to={`/wallet/transactions?asset=${asset}`}
      >
        <Icon
          className="size-4 shrink-0"
          icon={assets.find(a => a.id === asset)?.icon ?? ''}
        />
        {assets.find(a => a.id === asset)?.name}
      </Link>
    </td>
  )
}

export default AssetColumn
