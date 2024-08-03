import { Icon } from '@iconify/react'
import React from 'react'
import { Link } from 'react-router-dom'
import { type IWalletAsset } from '@interfaces/wallet_interfaces'

function AssetColumn({
  asset,
  assets
}: {
  asset: string
  assets: IWalletAsset[]
}): React.ReactElement {
  return (
    <td className="p-2 text-center">
      <Link
        to={`/wallet/transactions?asset=${asset}`}
        className="inline-flex w-min items-center gap-1 whitespace-nowrap rounded-full bg-bg-200 px-3 py-1 text-sm text-bg-500 dark:bg-bg-800 dark:text-bg-400"
      >
        <Icon
          icon={assets.find(a => a.id === asset)?.icon ?? ''}
          className="size-4 shrink-0"
        />
        {assets.find(a => a.id === asset)?.name}
      </Link>
    </td>
  )
}

export default AssetColumn
