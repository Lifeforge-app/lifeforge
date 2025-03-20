import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router'

import { QueryWrapper, SidebarItem, SidebarTitle } from '@lifeforge/ui'

import { useWalletContext } from '@apps/Wallet/providers/WalletProvider'

function AssetsSection({
  setSidebarOpen
}: {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { t } = useTranslation('apps.wallet')
  const [searchParams, setSearchParams] = useSearchParams()
  const { assetsQuery, filteredTransactions } = useWalletContext()
  const navigate = useNavigate()

  return (
    <>
      <SidebarTitle
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={() => {
          navigate('/wallet/assets#new')
        }}
        name={t('sidebar.assets')}
      />
      <QueryWrapper query={assetsQuery}>
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
                  active={
                    searchParams.get('asset') === id ||
                    (searchParams.get('asset') === null && index === 0)
                  }
                  icon={icon}
                  name={name}
                  number={
                    typeof filteredTransactions !== 'string'
                      ? filteredTransactions.filter(
                          transaction => transaction.asset === id || id === null
                        ).length
                      : 0
                  }
                  onCancelButtonClick={
                    name !== 'All'
                      ? () => {
                          searchParams.delete('asset')
                          setSearchParams(searchParams)
                          setSidebarOpen(false)
                        }
                      : undefined
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
                />
              ))}
          </>
        )}
      </QueryWrapper>
    </>
  )
}

export default AssetsSection
