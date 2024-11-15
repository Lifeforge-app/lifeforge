import React from 'react'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import SidebarItem from '@components/Sidebar/components/SidebarItem'
import SidebarTitle from '@components/Sidebar/components/SidebarTitle'
import { useWalletContext } from '@providers/WalletProvider'

function AssetsSection({
  setSidebarOpen
}: {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
  const { assets, filteredTransactions } = useWalletContext()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <>
      <SidebarTitle
        name="Assets"
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={() => {
          navigate('/wallet/assets#new')
        }}
      />
      <APIComponentWithFallback data={assets}>
        {assets => (
          <>
            {[
              {
                icon: 'tabler:coin',
                name: 'All',
                color: 'white',
                id: null,
                type: 'all'
              }
            ]
              .concat(assets as any)
              .map(({ icon, name, id }, index) => (
                <SidebarItem
                  key={id}
                  name={name}
                  icon={icon}
                  needTranslate={false}
                  active={
                    searchParams.get('asset') === id ||
                    (searchParams.get('asset') === null && index === 0)
                  }
                  number={
                    typeof filteredTransactions !== 'string'
                      ? filteredTransactions.filter(
                          transaction => transaction.asset === id || id === null
                        ).length
                      : 0
                  }
                  onClick={() => {
                    if (id === null) {
                      setSearchParams(searchParams => {
                        searchParams.delete('asset')
                        return searchParams
                      })
                    } else {
                      setSearchParams(searchParams => {
                        searchParams.set('asset', id)
                        return searchParams
                      })
                    }
                    setSidebarOpen(false)
                  }}
                  onCancelButtonClick={
                    name !== 'All'
                      ? () => {
                          setSearchParams(searchParams => {
                            searchParams.delete('asset')
                            return searchParams
                          })
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

export default AssetsSection
