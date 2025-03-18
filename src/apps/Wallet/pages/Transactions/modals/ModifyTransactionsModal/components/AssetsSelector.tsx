import { Icon } from '@iconify/react'

import {
  ListboxNullOption,
  ListboxOrComboboxInput,
  ListboxOrComboboxOption
} from '@lifeforge/ui'

import { useWalletContext } from '@apps/Wallet/providers/WalletProvider'

function AssetsSelector({
  transactionAsset,
  setTransactionAsset
}: {
  transactionAsset: string | null
  setTransactionAsset: React.Dispatch<React.SetStateAction<string | null>>
}) {
  const { assets } = useWalletContext()

  return (
    <ListboxOrComboboxInput
      required
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
      namespace="apps.wallet"
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
