import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { QueryWrapper, SidebarTitle } from '@lifeforge/ui'

import { useWalletData } from '@apps/Wallet/hooks/useWalletData'
import { useWalletStore } from '@apps/Wallet/stores/useWalletStore'

import LedgerSectionItem from './LedgerSectionItem'

function LedgerSection() {
  const { t } = useTranslation('apps.wallet')
  const navigate = useNavigate()
  const { ledgersQuery } = useWalletData()
  const { selectedLedger } = useWalletStore()

  const ledgers = useMemo(
    () =>
      [
        {
          icon: 'tabler:book',
          name: t('sidebar.allLedgers'),
          color: 'white',
          id: null,
          amount: undefined
        }
      ].concat(ledgersQuery.data ?? ([] as any)),
    [ledgersQuery.data, selectedLedger, t]
  )

  return (
    <>
      <SidebarTitle
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={() => {
          navigate('/wallet/ledgers#new')
        }}
        name={t('sidebar.ledgers')}
      />
      <QueryWrapper query={ledgersQuery}>
        {() => (
          <>
            {ledgers.map(({ icon, name, color, id, amount }) => (
              <LedgerSectionItem
                key={id}
                amount={amount}
                color={color}
                icon={icon}
                id={id}
                name={name}
              />
            ))}
          </>
        )}
      </QueryWrapper>
    </>
  )
}

export default LedgerSection
