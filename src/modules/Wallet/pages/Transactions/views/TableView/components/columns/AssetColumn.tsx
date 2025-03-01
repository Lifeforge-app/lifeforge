import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'
import { Link } from 'react-router'
import useThemeColors from '@hooks/useThemeColor'
import { type IWalletAsset } from '@interfaces/wallet_interfaces'

function AssetColumn({
  asset,
  assets
}: {
  asset: string
  assets: IWalletAsset[]
}): React.ReactElement {
  const { componentBgLighter } = useThemeColors()

  return (
    <td className="p-2 text-center">
      <Link
        className={clsx(
          'inline-flex w-min items-center gap-1 whitespace-nowrap rounded-full px-3 py-1 text-sm text-bg-500 dark:text-bg-400!',
          componentBgLighter
        )}
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
