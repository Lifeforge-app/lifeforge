import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import GoBackButton from '@components/ButtonsAndInputs/GoBackButton'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import SidebarDivider from '@components/Sidebar/components/SidebarDivider'
import SidebarItem from '@components/Sidebar/components/SidebarItem'
import SidebarTitle from '@components/Sidebar/components/SidebarTitle'
import {
  type IWalletCategoryEntry,
  type IWalletTransactionEntry,
  type IWalletAssetEntry,
  type IWalletLedgerEntry
} from '@typedec/Wallet'

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  categories,
  transactions,
  assets,
  ledgers
}: {
  sidebarOpen: boolean
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
  categories: IWalletCategoryEntry[] | string
  transactions: IWalletTransactionEntry[] | string
  assets: IWalletAssetEntry[] | string
  ledgers: IWalletLedgerEntry[] | string
}): React.ReactElement {
  return (
    <aside
      className={`absolute ${
        sidebarOpen ? 'left-0' : 'left-full'
      } top-0 z-[9999] size-full min-w-0 overflow-y-scroll rounded-lg bg-bg-50 py-4 shadow-custom duration-300 dark:bg-bg-900 lg:static lg:h-[calc(100%-2rem)] lg:w-1/4`}
    >
      <div className="flex items-center justify-between px-8 py-4 lg:hidden">
        <GoBackButton
          onClick={() => {
            setSidebarOpen(false)
          }}
        />
      </div>
      <ul className="flex min-w-0 flex-col overflow-y-hidden hover:overflow-y-scroll">
        <SidebarItem icon="tabler:list" name="All Transactions" />
        <SidebarDivider />
        <SidebarTitle name="Type" />
        {[
          ['tabler:login-2', 'Income'],
          ['tabler:logout', 'Expenses'],
          ['tabler:transfer', 'Transfer']
        ].map(([icon, name], index) => (
          <li
            key={index}
            className="relative flex items-center gap-6 px-4 font-medium text-bg-500 transition-all"
          >
            <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-800">
              <Icon icon={icon} className="size-6 shrink-0" />
              <div className="flex w-full items-center justify-between">
                {name}
              </div>
              <span className="text-sm">{Math.floor(Math.random() * 10)}</span>
            </div>
          </li>
        ))}
        <SidebarDivider />
        <SidebarTitle name="categories" />
        <APIComponentWithFallback data={categories}>
          {typeof categories !== 'string' &&
            categories.map(({ icon, name, color, id }, index) => (
              <li
                key={index}
                className="relative flex items-center gap-6 px-4 font-medium text-bg-500 transition-all"
              >
                <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-200/50 dark:hover:bg-bg-800">
                  <span
                    className="block h-8 w-1 shrink-0 rounded-full"
                    style={{
                      backgroundColor: color
                    }}
                  />
                  <Icon icon={icon} className="size-6 shrink-0" />
                  <div className="flex w-full items-center justify-between">
                    {name}
                  </div>
                  <span className="text-sm">
                    {typeof transactions !== 'string' &&
                      transactions.filter(
                        transaction => transaction.category === id
                      ).length}
                  </span>
                </div>
              </li>
            ))}
        </APIComponentWithFallback>
        <SidebarDivider />
        <SidebarTitle name="Assets" />
        <APIComponentWithFallback data={assets}>
          {typeof assets !== 'string' &&
            assets.map(({ icon, name, id }, index) => (
              <li
                key={index}
                className="relative flex items-center gap-6 px-4 font-medium text-bg-500 transition-all"
              >
                <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-200/50 dark:hover:bg-bg-800">
                  <Icon icon={icon} className="size-6 shrink-0" />
                  <div className="flex w-full items-center justify-between">
                    {name}
                  </div>
                  <span className="text-sm">
                    {typeof transactions !== 'string' &&
                      transactions.filter(
                        transaction => transaction.asset === id
                      ).length}
                  </span>
                </div>
              </li>
            ))}
        </APIComponentWithFallback>
        <SidebarDivider />
        <SidebarTitle name="Ledgers" />
        <APIComponentWithFallback data={ledgers}>
          {typeof ledgers !== 'string' &&
            ledgers.map(({ icon, name, color, id }, index) => (
              <li
                key={index}
                className="relative flex min-w-0 items-center gap-6 px-4 font-medium text-bg-500 transition-all"
              >
                <div className="flex w-full min-w-0 items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-200/50 dark:hover:bg-bg-800">
                  <span
                    className="block h-8 w-1 shrink-0 rounded-full"
                    style={{
                      backgroundColor: color
                    }}
                  />
                  <Icon icon={icon} className="size-6 shrink-0" />
                  <div className="w-full min-w-0 items-center justify-between truncate">
                    {name}
                  </div>
                  <span className="text-sm">
                    {typeof transactions !== 'string' &&
                      transactions.filter(
                        transaction => transaction.ledger === id
                      ).length}
                  </span>
                </div>
              </li>
            ))}
        </APIComponentWithFallback>
      </ul>
    </aside>
  )
}

export default Sidebar
