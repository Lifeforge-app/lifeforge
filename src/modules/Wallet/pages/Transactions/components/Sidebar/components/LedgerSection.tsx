import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router'
import { SidebarItem, SidebarTitle } from '@components/layouts/sidebar'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import { useWalletContext } from '@providers/WalletProvider'

function LedgerSection({
  setSidebarOpen
}: {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
  const { t } = useTranslation('modules.wallet')
  const [searchParams, setSearchParams] = useSearchParams()
  const { ledgers, filteredTransactions } = useWalletContext()
  const navigate = useNavigate()

  return (
    <>
      <SidebarTitle
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={() => {
          navigate('/wallet/ledgers#new')
        }}
        name={t('sidebar.ledgers')}
      />
      <APIFallbackComponent data={ledgers}>
        {ledgers => (
          <>
            {[
              {
                icon: 'tabler:book',
                name: t('sidebar.allLedgers'),
                color: 'white',
                id: null
              }
            ]
              .concat(ledgers as any)
              .map(({ icon, name, color, id }, index) => (
                <SidebarItem
                  key={id}
                  active={
                    searchParams.get('ledger') === id ||
                    (searchParams.get('ledger') === null && index === 0)
                  }
                  icon={icon}
                  name={name}
                  number={
                    typeof filteredTransactions !== 'string'
                      ? filteredTransactions.filter(
                          transaction =>
                            transaction.ledger === id || id === null
                        ).length
                      : 0
                  }
                  sideStripColor={color}
                  onCancelButtonClick={
                    name !== 'All'
                      ? () => {
                          searchParams.delete('ledger')
                          setSearchParams(searchParams)
                          setSidebarOpen(false)
                        }
                      : undefined
                  }
                  onClick={() => {
                    if (name === 'All') {
                      searchParams.delete('ledger')
                      setSearchParams(searchParams)
                      return
                    }
                    setSearchParams({
                      ...Object.fromEntries(searchParams.entries()),
                      ledger: id!
                    })
                    setSidebarOpen(false)
                  }}
                />
              ))}
          </>
        )}
      </APIFallbackComponent>
    </>
  )
}

export default LedgerSection
