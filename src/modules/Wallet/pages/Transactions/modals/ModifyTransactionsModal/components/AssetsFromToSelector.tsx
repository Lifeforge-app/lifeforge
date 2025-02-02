import React from 'react'
import { useWalletContext } from '@providers/WalletProvider'
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
  const { assets } = useWalletContext()

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
        iconName="tabler:step-out"
        label="From Asset"
        selectedAsset={fromAsset}
        onAssetChange={setFromAsset}
      />
      <AssetListbox
        assets={assets}
        iconName="tabler:step-into"
        label="To Asset"
        selectedAsset={toAsset}
        onAssetChange={setToAsset}
      />
    </>
  )
}

export default AssetsFromToSelector
