import { Icon } from '@iconify/react'
import React from 'react'
import {
  ListboxOrComboboxInput,
  ListboxNullOption,
  ListboxOrComboboxOption
} from '@components/inputs'
import { useWalletContext } from '@providers/WalletProvider'

function LedgerSelector({
  ledger,
  setLedger
}: {
  ledger: string | null
  setLedger: React.Dispatch<React.SetStateAction<string | null>>
}): React.ReactElement {
  const { ledgers } = useWalletContext()

  if (ledgers === 'loading') {
    return <div>Loading...</div>
  }

  if (ledgers === 'error') {
    return <div>Error</div>
  }

  return (
    <ListboxOrComboboxInput
      buttonContent={
        <>
          <Icon
            className="size-5"
            icon={ledgers.find(l => l.id === ledger)?.icon ?? 'tabler:book-off'}
            style={{
              color: ledgers.find(l => l.id === ledger)?.color
            }}
          />
          <span className="-mt-px block truncate">
            {ledgers.find(l => l.id === ledger)?.name ?? 'None'}
          </span>
        </>
      }
      icon="tabler:book"
      name="Ledger"
      namespace="modules.wallet"
      setValue={setLedger}
      type="listbox"
      value={ledger}
    >
      <ListboxNullOption hasBgColor icon="tabler:book-off" value={null} />
      {ledgers.map(({ name, color, id, icon }) => (
        <ListboxOrComboboxOption
          key={id}
          color={color}
          icon={icon}
          text={name}
          value={id}
        />
      ))}
    </ListboxOrComboboxInput>
  )
}

export default LedgerSelector
