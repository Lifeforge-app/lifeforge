/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import SidebarTitle from '@components/Sidebar/components/SidebarTitle'
import { useWalletContext } from '@providers/WalletProvider'

function CategoriesSection({
  setManageCategoriesModalOpen,
  setSidebarOpen
}: {
  setManageCategoriesModalOpen: React.Dispatch<
    React.SetStateAction<boolean | 'new'>
  >
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
  const { t } = useTranslation()
  const { categories, transactions } = useWalletContext()
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <>
      <SidebarTitle
        name="categories"
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={() => {
          setManageCategoriesModalOpen('new')
        }}
      />
      <APIComponentWithFallback data={categories}>
        {categories => (
          <>
            {[
              {
                icon: 'tabler:tag',
                name: 'All',
                color: 'white',
                id: null,
                type: 'all'
              }
            ]
              .concat(
                categories.sort(
                  (a, b) =>
                    ['income', 'expenses'].indexOf(a.type) -
                    ['income', 'expenses'].indexOf(b.type)
                ) as any
              )
              .map(({ icon, name, color, id, type }, index) => (
                <li
                  key={index}
                  className={`relative flex items-center gap-6 px-4 font-medium transition-all ${
                    searchParams.get('category') === id ||
                    (name === 'All' && searchParams.get('category') === null)
                      ? "text-bg-800 after:absolute after:right-0 after:top-1/2 after:h-8 after:w-1 after:-translate-y-1/2 after:rounded-full after:bg-custom-500 after:content-[''] dark:text-bg-50"
                      : 'text-bg-500 dark:text-bg-500'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (name === 'All') {
                        setSearchParams(searchParams => {
                          searchParams.delete('category')
                          searchParams.delete('type')
                          return searchParams
                        })
                        setSidebarOpen(false)
                        return
                      }
                      setSearchParams({
                        ...Object.fromEntries(searchParams.entries()),
                        category: id!,
                        type
                      })
                      setSidebarOpen(false)
                    }}
                    className={`flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 text-left ${
                      searchParams.get('category') === id ||
                      (name === 'All' && searchParams.get('category') === null)
                        ? 'bg-bg-200/50'
                        : 'hover:bg-bg-100/50 dark:hover:bg-bg-800'
                    }`}
                  >
                    <span
                      className="block h-8 w-1 shrink-0 rounded-full"
                      style={{
                        backgroundColor: color
                      }}
                    />
                    <div className="relative">
                      <Icon icon={icon} className="size-6 shrink-0" />
                      <Icon
                        icon={
                          {
                            income: 'tabler:login-2',
                            expenses: 'tabler:logout',
                            all: 'tabler:arrow-bar-both'
                          }[type] ?? ''
                        }
                        className={`absolute -bottom-2 -right-2 size-4 shrink-0 ${
                          {
                            income: 'text-green-500',
                            expenses: 'text-red-500',
                            all: 'text-yellow-500'
                          }[type]
                        }`}
                      />
                    </div>
                    <div className="flex-between w-full truncate">
                      {name === 'All'
                        ? t('sidebar.wallet.allCategories')
                        : name}
                    </div>
                    <span className="text-sm">
                      {typeof transactions !== 'string' &&
                        transactions.filter(
                          transaction =>
                            transaction.category === id || name === 'All'
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

export default CategoriesSection
