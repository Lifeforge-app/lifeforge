import { useWalletData } from '@apps/Wallet/hooks/useWalletData'

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
}) {
  const { assetsQuery } = useWalletData()
  const assets = assetsQuery.data ?? []

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
