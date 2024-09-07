import { ListboxOption } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ListboxInput from '@components/ButtonsAndInputs/ListboxInput'
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
    <ListboxInput
      name={t('input.ledger')}
      icon="tabler:book"
      value={ledger}
      setValue={setLedger}
      buttonContent={
        <>
          <Icon
            icon={ledgers.find(l => l.id === ledger)?.icon ?? 'tabler:book'}
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
      <ListboxOption
        key={'none'}
        className="flex-between relative flex cursor-pointer select-none p-4 transition-all hover:bg-bg-200/50 hover:dark:bg-bg-700/50"
        value={null}
      >
        {({ selected }) => (
          <>
            <div>
              <span className="flex items-center gap-2 font-medium">
                <span
                  className="rounded-md p-2"
                  style={{ backgroundColor: '#FFFFFF20' }}
                >
                  <Icon
                    icon="tabler:book"
                    className="size-5"
                    style={{ color: 'white' }}
                  />
                </span>
                {t('input.none')}
              </span>
            </div>
            {selected && (
              <Icon
                icon="tabler:check"
                className="block text-lg text-custom-500"
              />
            )}
          </>
        )}
      </ListboxOption>
      {ledgers.map(({ name, color, id, icon }, i) => (
        <ListboxOption
          key={i}
          className="flex-between relative flex cursor-pointer select-none p-4 transition-all hover:bg-bg-200/50 hover:dark:bg-bg-700/50"
          value={id}
        >
          {({ selected }) => (
            <>
              <div>
                <span className="flex items-center gap-2 font-medium">
                  <span
                    className="rounded-md p-2"
                    style={{ backgroundColor: color + '20' }}
                  >
                    <Icon icon={icon} className="size-5" style={{ color }} />
                  </span>
                  {name}
                </span>
              </div>
              {selected && (
                <Icon
                  icon="tabler:check"
                  className="block text-lg text-custom-500"
                />
              )}
            </>
          )}
        </ListboxOption>
      ))}
    </ListboxInput>
  )
}

export default LedgerSelector
