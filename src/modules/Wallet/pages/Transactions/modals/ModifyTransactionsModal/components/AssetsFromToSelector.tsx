import { t } from 'i18next'
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
        selectedAsset={fromAsset}
        onAssetChange={setFromAsset}
        label={t('input.fromAsset')}
        iconName="tabler:step-out"
      />
      <AssetListbox
        assets={assets}
        selectedAsset={toAsset}
        onAssetChange={setToAsset}
        label={t('input.toAsset')}
        iconName="tabler:step-into"
      />
    </>
  )
}

export default AssetsFromToSelector
