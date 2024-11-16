/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'
import { useNavigate } from 'react-router'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import SidebarItem from '@components/Sidebar/components/SidebarItem'
import SidebarTitle from '@components/Sidebar/components/SidebarTitle'
import { useWalletContext } from '@providers/WalletProvider'

function LedgerSection({
  setSidebarOpen
}: {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
  const { ledgers, filteredTransactions, searchParams, setSearchParams } =
    useWalletContext()
  const navigate = useNavigate()

  return (
    <>
      <SidebarTitle
        name="Ledgers"
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={() => {
          navigate('/wallet/ledgers#new')
        }}
      />
      <APIComponentWithFallback data={ledgers}>
        {ledgers => (
          <>
            {[
              {
                icon: 'tabler:book',
                name: 'All',
                color: 'white',
                id: null
              }
            ]
              .concat(ledgers as any)
              .map(({ icon, name, color, id }, index) => (
                <SidebarItem
                  key={id}
                  name={name}
                  icon={icon}
                  needTranslate={false}
                  color={color}
                  active={
                    searchParams.get('ledger') === id ||
                    (searchParams.get('ledger') === null && index === 0)
                  }
                  number={
                    typeof filteredTransactions !== 'string'
                      ? filteredTransactions.filter(
                          transaction =>
                            transaction.ledger === id || id === null
                        ).length
                      : 0
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
                  onCancelButtonClick={
                    name !== 'All'
                      ? () => {
                          searchParams.delete('ledger')
                          setSearchParams(searchParams)
                          setSidebarOpen(false)
                        }
                      : undefined
                  }
                />
              ))}
          </>
        )}
      </APIComponentWithFallback>
    </>
  )
}

export default LedgerSection
