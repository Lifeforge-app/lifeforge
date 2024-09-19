/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import SidebarTitle from '@components/Sidebar/components/SidebarTitle'
import { useWalletContext } from '@providers/WalletProvider'

function AssetsSection({
  setSidebarOpen
}: {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
  const { t } = useTranslation()
  const { assets, transactions } = useWalletContext()
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
                <li
                  key={index}
                  className={`relative flex items-center gap-6 px-4 font-medium transition-all ${
                    searchParams.get('asset') === id ||
                    (name === 'All' && searchParams.get('asset') === null)
                      ? "text-bg-800 after:absolute after:right-0 after:top-1/2 after:h-8 after:w-1 after:-translate-y-1/2 after:rounded-full after:bg-custom-500 after:content-[''] dark:text-bg-100"
                      : 'text-bg-500 dark:text-bg-500'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (name === 'All') {
                        setSearchParams(searchParams => {
                          searchParams.delete('asset')
                          return searchParams
                        })
                        setSidebarOpen(false)
                        return
                      }
                      setSearchParams({
                        ...Object.fromEntries(searchParams.entries()),
                        asset: id!
                      })
                      setSidebarOpen(false)
                    }}
                    className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 text-left hover:bg-bg-100 dark:hover:bg-bg-800"
                  >
                    <Icon icon={icon} className="size-6 shrink-0" />
                    <div className="flex-between w-full truncate">
                      {name === 'All' ? t('sidebar.wallet.allAssets') : name}
                    </div>
                    <span className="text-sm">
                      {typeof transactions !== 'string' &&
                        transactions.filter(
                          transaction =>
                            transaction.asset === id || name === 'All'
                        ).length}
                    </span>
                  </button>
                </li>
              ))}
          </>
        )}
      </APIComponentWithFallback>
    </>
  )
}

export default AssetsSection
