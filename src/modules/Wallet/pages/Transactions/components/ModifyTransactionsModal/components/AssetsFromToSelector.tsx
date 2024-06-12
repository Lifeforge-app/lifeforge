import React from 'react'
import useFetch from '@hooks/useFetch'
import { type IWalletAssetEntry } from '@interfaces/wallet_interfaces'
import AssetListbox from './AssetsListbox'

function AssetsFromToSelector({
  fromAsset,
  setFromAsset,
  toAsset,
  setToAsset
}: {
  fromAsset: string | null
  setFromAsset: React.Dispatch<React.SetStateAction<string | null>>
  toAsset: string | null
  setToAsset: React.Dispatch<React.SetStateAction<string | null>>
}): React.ReactElement {
  const [assets] = useFetch<IWalletAssetEntry[]>('wallet/assets/list')

  if (assets === 'loading') {
    return <div>Loading...</div>
  }

  if (assets === 'error') {
    return <div>Error</div>
  }

  return (
    <>
      <AssetListbox
        assets={assets}
        selectedAsset={fromAsset}
        onAssetChange={setFromAsset}
        label="From Asset"
        iconName="tabler:step-out"
      />
      <AssetListbox
        assets={assets}
        selectedAsset={toAsset}
        onAssetChange={setToAsset}
        label="To Asset"
        iconName="tabler:step-into"
      />
    </>
  )
}

export default AssetsFromToSelector
