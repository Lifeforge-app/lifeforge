import { Icon } from '@iconify/react'
import React from 'react'
import {
  ListboxOrComboboxInput,
  ListboxNullOption,
  ListboxOrComboboxOption
} from '@components/inputs'
import { useWalletContext } from '@providers/WalletProvider'

function AssetsSelector({
  transactionAsset,
  setTransactionAsset
}: {
  transactionAsset: string | null
  setTransactionAsset: React.Dispatch<React.SetStateAction<string | null>>
}): React.ReactElement {
  const { assets } = useWalletContext()

  if (assets === 'loading') {
    return <div>Loading...</div>
  }

  if (assets === 'error') {
    return <div>Error</div>
  }

  return (
    <ListboxOrComboboxInput
      buttonContent={
        <>
          <Icon
            className="size-5"
            icon={
              assets.find(l => l.id === transactionAsset)?.icon ??
              'tabler:wallet-off'
            }
          />
          <span className="-mt-px block truncate">
            {assets.find(l => l.id === transactionAsset)?.name ?? 'None'}
          </span>
        </>
      }
      icon="tabler:wallet"
      name="Asset"
      namespace="modules.wallet"
      setValue={setTransactionAsset}
      type="listbox"
      value={transactionAsset}
    >
      <ListboxNullOption icon="tabler:wallet-off" value={null} />
      {assets.map(({ name, id, icon }, i) => (
        <ListboxOrComboboxOption key={i} icon={icon} text={name} value={id} />
      ))}
    </ListboxOrComboboxInput>
  )
}

export default AssetsSelector
