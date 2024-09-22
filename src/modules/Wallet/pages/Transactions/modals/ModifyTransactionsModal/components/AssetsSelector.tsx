import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ListboxInput from '@components/ButtonsAndInputs/ListboxInput'
import ListboxNullOption from '@components/ButtonsAndInputs/ListboxInput/components/ListboxNullOption'
import ListboxOption from '@components/ButtonsAndInputs/ListboxInput/components/ListboxOption'
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
    <ListboxInput
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
        <ListboxOption key={i} text={name} icon={icon} value={id} />
      ))}
    </ListboxInput>
  )
}

export default AssetsSelector
