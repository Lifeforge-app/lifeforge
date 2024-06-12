import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import SidebarTitle from '@components/Sidebar/components/SidebarTitle'
import { type IWalletTransactionEntry } from '@interfaces/wallet_interfaces'

function TypeSection({
  setSidebarOpen,
  transactions
}: {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
  transactions: IWalletTransactionEntry[] | 'loading' | 'error'
}): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <>
      <SidebarTitle name="Type" />
      {[
        ['tabler:arrow-bar-both', 'All'],
        ['tabler:login-2', 'Income'],
        ['tabler:logout', 'Expenses'],
        ['tabler:transfer', 'Transfer']
      ].map(([icon, name], index) => (
        <li
          key={index}
          className={`relative flex items-center gap-6 px-4 font-medium transition-all ${
            searchParams.get('type') === name.toLowerCase() ||
            (name === 'All' && searchParams.get('type') === null)
              ? "text-bg-800 after:absolute after:right-0 after:top-1/2 after:h-8 after:w-1 after:-translate-y-1/2 after:rounded-full after:bg-custom-500 after:content-[''] dark:text-bg-100"
              : 'text-bg-500 dark:text-bg-500'
          }`}
        >
          <button
            type="button"
            onClick={() => {
              if (name === 'All') {
                setSearchParams(searchParams => {
                  searchParams.delete('type')
                  return searchParams
                })
                setSidebarOpen(false)
                return
              }
              searchParams.delete('category')
              setSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                type: name.toLowerCase()
              })
              setSidebarOpen(false)
            }}
            className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 text-left hover:bg-bg-800"
          >
            <Icon
              icon={icon}
              className={`size-6 shrink-0 ${
                {
                  All: 'text-bg-100',
                  Income: 'text-green-500',
                  Expenses: 'text-red-500',
                  Transfer: 'text-blue-500'
                }[name]
              }`}
            />
            <div className="w-full items-center justify-between truncate">
              {name}
            </div>
            <span className="text-sm">
              {typeof transactions !== 'string' &&
                transactions.filter(
                  transaction =>
                    transaction.type === name.toLowerCase() || name === 'All'
                ).length}
            </span>
          </button>
        </li>
      ))}
    </>
  )
}

export default TypeSection
