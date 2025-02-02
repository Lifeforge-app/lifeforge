import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { SidebarItem, SidebarTitle } from '@components/layouts/sidebar'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
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
  const { t } = useTranslation('modules.wallet')
  const [searchParams, setSearchParams] = useSearchParams()
  const { categories, filteredTransactions } = useWalletContext()

  return (
    <>
      <SidebarTitle
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={() => {
          setManageCategoriesModalOpen('new')
        }}
        name={t('sidebar.categories')}
      />
      <APIFallbackComponent data={categories}>
        {categories => (
          <>
            {[
              {
                icon: 'tabler:tag',
                name: t('sidebar.allCategories'),
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
              .map(({ icon, name, color, id, type }) => (
                <SidebarItem
                  key={id}
                  active={searchParams.get('category') === id}
                  icon={
                    <div className="relative flex size-7 items-center justify-center">
                      <Icon
                        className={`size-6 shrink-0 ${
                          searchParams.get('category') === id
                            ? 'text-custom-500'
                            : ''
                        }`}
                        icon={icon}
                      />
                      <Icon
                        className={`absolute -bottom-2 -right-2 size-4 shrink-0 ${
                          {
                            income: 'text-green-500',
                            expenses: 'text-red-500',
                            all: 'text-yellow-500'
                          }[type]
                        }`}
                        icon={
                          {
                            income: 'tabler:login-2',
                            expenses: 'tabler:logout',
                            all: 'tabler:arrow-bar-both'
                          }[type] ?? ''
                        }
                      />
                    </div>
                  }
                  name={name}
                  number={
                    typeof filteredTransactions !== 'string'
                      ? filteredTransactions.filter(
                          transaction =>
                            transaction.category === id || name === 'All'
                        ).length
                      : 0
                  }
                  sideStripColor={color}
                  onCancelButtonClick={
                    name !== 'All'
                      ? () => {
                          searchParams.delete('category')
                          searchParams.delete('type')
                          setSearchParams(searchParams)
                          setSidebarOpen(false)
                        }
                      : undefined
                  }
                  onClick={() => {
                    if (name === 'All') {
                      searchParams.delete('category')
                      searchParams.delete('type')
                      setSearchParams(searchParams)
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
                />
              ))}
          </>
        )}
      </APIFallbackComponent>
    </>
  )
}

export default CategoriesSection
