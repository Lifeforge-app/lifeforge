import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ListboxOrComboboxInput from '@components/ButtonsAndInputs/ListboxOrComboboxInput'
import ListboxNullOption from '@components/ButtonsAndInputs/ListboxOrComboboxInput/components/ListboxNullOption'
import ListboxOrComboboxOption from '@components/ButtonsAndInputs/ListboxOrComboboxInput/components/ListboxOrComboboxOption'
import { useWalletContext } from '@providers/WalletProvider'

function AssetsSelector({
  transactionAsset,
  setTransactionAsset
}: {
  transactionAsset: string | null
  setTransactionAsset: React.Dispatch<React.SetStateAction<string | null>>
}): React.ReactElement {
  const { t } = useTranslation()
  const { assets } = useWalletContext()

  if (assets === 'loading') {
    return <div>Loading...</div>
  }

  if (assets === 'error') {
    return <div>Error</div>
  }

  return (
    <ListboxOrComboboxInput
      type="listbox"
      name={t('input.asset')}
      icon="tabler:wallet"
      value={transactionAsset}
      setValue={setTransactionAsset}
      buttonContent={
        <>
          <Icon
            icon={
              assets.find(l => l.id === transactionAsset)?.icon ??
              'tabler:wallet-off'
            }
            className="size-5"
          />
          <span className="-mt-px block truncate">
            {assets.find(l => l.id === transactionAsset)?.name ?? 'None'}
          </span>
        </>
      }
    >
      <ListboxNullOption icon="tabler:wallet-off" value={null} />
      {assets.map(({ name, id, icon }, i) => (
        <ListboxOrComboboxOption key={i} text={name} icon={icon} value={id} />
      ))}
    </ListboxOrComboboxInput>
  )
}

export default AssetsSelector
