import { Icon } from '@iconify/react'
import {
  ListboxNullOption,
  ListboxOrComboboxInput,
  ListboxOrComboboxOption
} from 'lifeforge-ui'

import { useWalletData } from '@apps/Wallet/hooks/useWalletData'

function LedgerSelector({
  ledger,
  setLedger
}: {
  ledger: string | null
  setLedger: React.Dispatch<React.SetStateAction<string | null>>
}) {
  const { ledgersQuery } = useWalletData()

  const ledgers = ledgersQuery.data ?? []

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
      namespace="apps.wallet"
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
