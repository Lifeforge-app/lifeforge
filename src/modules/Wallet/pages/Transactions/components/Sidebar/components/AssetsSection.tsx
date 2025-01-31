import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import { SidebarItem, SidebarTitle } from '@components/layouts/sidebar'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import { useWalletContext } from '@providers/WalletProvider'

function AssetsSection({
  setSidebarOpen
}: {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
  const { t } = useTranslation('modules.wallet')
  const [searchParams, setSearchParams] = useSearchParams()
  const { assets, filteredTransactions } = useWalletContext()
  const navigate = useNavigate()

  return (
    <>
      <SidebarTitle
        name={t('sidebar.assets')}
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={() => {
          navigate('/wallet/assets#new')
        }}
      />
      <APIFallbackComponent data={assets}>
        {assets => (
          <>
            {[
              {
                icon: 'tabler:coin',
                name: t('sidebar.allAssets'),
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
                      searchParams.delete('asset')
                      setSearchParams(searchParams)
                    } else {
                      searchParams.set('asset', id)
                      setSearchParams(searchParams)
                    }
                    setSidebarOpen(false)
                  }}
                  onCancelButtonClick={
                    name !== 'All'
                      ? () => {
                          searchParams.delete('asset')
                          setSearchParams(searchParams)
                          setSidebarOpen(false)
                        }
                      : undefined
                  }
                />
              ))}
          </>
        )}
      </APIFallbackComponent>
    </>
  )
}

export default AssetsSection
