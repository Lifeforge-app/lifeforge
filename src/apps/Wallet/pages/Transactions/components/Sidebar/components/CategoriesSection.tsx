import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import { QueryWrapper, SidebarItem, SidebarTitle } from '@lifeforge/ui'

import { useWalletContext } from '@apps/Wallet/providers/WalletProvider'

function CategoriesSection({
  setManageCategoriesModalOpen,
  setSidebarOpen
}: {
  setManageCategoriesModalOpen: React.Dispatch<
    React.SetStateAction<boolean | 'new'>
  >
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { t } = useTranslation('apps.wallet')
  const [searchParams, setSearchParams] = useSearchParams()
  const { categoriesQuery, filteredTransactions } = useWalletContext()

  return searchParams.get('type') !== 'transfer' ? (
    <>
      <SidebarTitle
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={() => {
          setManageCategoriesModalOpen('new')
        }}
        name={t('sidebar.categories')}
      />
      <QueryWrapper query={categoriesQuery}>
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
              .filter(
                ({ type }) =>
                  searchParams.get('type') === type ||
                  (searchParams.get('type') ?? 'all') === 'all'
              )
              .map(({ icon, name, color, id, type }) => (
                <SidebarItem
                  key={id}
                  active={searchParams.get('category') === id}
                  icon={
                    <div className="relative flex size-7 items-center justify-center">
                      <Icon
                        className={clsx(
                          'size-6 shrink-0',
                          searchParams.get('category') === id &&
                            'text-custom-500'
                        )}
                        icon={icon}
                      />
                      <Icon
                        className={clsx(
                          'absolute -right-2 -bottom-2 size-4 shrink-0',
                          {
                            income: 'text-green-500',
                            expenses: 'text-red-500',
                            all: 'text-yellow-500'
                          }[type]
                        )}
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
      </QueryWrapper>
    </>
  ) : (
    <></>
  )
}

export default CategoriesSection
