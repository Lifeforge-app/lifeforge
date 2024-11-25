import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ListboxOrComboboxInput from '@components/ButtonsAndInputs/ListboxOrComboboxInput'
import ListboxNullOption from '@components/ButtonsAndInputs/ListboxOrComboboxInput/components/ListboxNullOption'
import ListboxOrComboboxOption from '@components/ButtonsAndInputs/ListboxOrComboboxInput/components/ListboxOrComboboxOption'
import { useWalletContext } from '@providers/WalletProvider'

function LedgerSelector({
  ledger,
  setLedger
}: {
  ledger: string | null
  setLedger: React.Dispatch<React.SetStateAction<string | null>>
}): React.ReactElement {
  const { t } = useTranslation()
  const { ledgers } = useWalletContext()

  if (ledgers === 'loading') {
    return <div>Loading...</div>
  }

  if (ledgers === 'error') {
    return <div>Error</div>
  }

  return (
    <ListboxOrComboboxInput
      name={t('input.ledger')}
      icon="tabler:book"
      value={ledger}
      setValue={setLedger}
      buttonContent={
        <>
          <Icon
            icon={ledgers.find(l => l.id === ledger)?.icon ?? 'tabler:book-off'}
            style={{
              color: ledgers.find(l => l.id === ledger)?.color
            }}
            className="size-5"
          />
          <span className="-mt-px block truncate">
            {ledgers.find(l => l.id === ledger)?.name ?? 'None'}
          </span>
        </>
      }
    >
      <ListboxNullOption icon="tabler:book-off" value={null} hasBgColor />
      {ledgers.map(({ name, color, id, icon }) => (
        <ListboxOrComboboxOption
          key={id}
          text={name}
          icon={icon}
          color={color}
          value={id}
        />
      ))}
    </ListboxOrComboboxInput>
  )
}

export default LedgerSelector
