import { useMemo } from 'react'
import { useNavigate } from 'react-router'

import { useModuleTranslation } from '@lifeforge/localization'
import { SidebarTitle, WithQuery } from '@lifeforge/ui'

import useFilter from '@/hooks/useFilter'
import { useWalletData } from '@/hooks/useWalletData'

import LedgerSectionItem from './LedgerSectionItem'

function LedgerSection() {
  const { t } = useModuleTranslation()
  const navigate = useNavigate()
  const { ledgersQuery } = useWalletData()
  const { ledger } = useFilter()

  const ledgers = useMemo(
    () =>
      [
        {
          icon: 'tabler:book',
          name: 'allLedgers',
          color: 'white',
          id: null,
          amount: undefined
        }
      ].concat(ledgersQuery.data ?? ([] as any)),
    [ledgersQuery.data, ledger, t]
  )

  return (
    <>
      <SidebarTitle
        actionButton={{
          icon: 'tabler:plus',
          onClick: () => {
            navigate('/wallet/ledgers#new')
          }
        }}
        label="ledgers"
      />
      <WithQuery query={ledgersQuery}>
        {() => (
          <>
            {ledgers.map(({ icon, name, color, id, amount }) => (
              <LedgerSectionItem
                key={id}
                amount={amount}
                color={color}
                icon={icon}
                id={id}
                label={name}
              />
            ))}
          </>
        )}
      </WithQuery>
    </>
  )
}

export default LedgerSection
