import { Icon } from '@iconify/react'
import { Link } from 'react-router'

import {
  DashboardItem,
  EmptyStateScreen,
  QueryWrapper,
  Scrollbar
} from '@lifeforge/ui'

import { useWalletData } from '@apps/Wallet/hooks/useWalletData'

import ListView from './views/ListView'
import TableView from './views/TableView'

function TransactionsCard() {
  const { transactionsQuery, categoriesQuery } = useWalletData()

  return (
    <DashboardItem
      className="col-span-2 row-span-3"
      componentBesideTitle={
        <Link
          className="text-bg-500 hover:bg-bg-100 hover:text-bg-800 dark:hover:bg-bg-700/30 dark:hover:text-bg-50 flex items-center gap-2 rounded-lg p-2 font-medium transition-all"
          to="/wallet/transactions"
        >
          <Icon className="text-xl" icon="tabler:chevron-right" />
        </Link>
      }
      icon="tabler:list"
      namespace="apps.wallet"
      title="Recent Transactions"
    >
      <QueryWrapper query={transactionsQuery}>
        {transactions => (
          <QueryWrapper query={categoriesQuery}>
            {categories => (
              <div className="size-full min-h-96 xl:min-h-0">
                <Scrollbar>
                  {transactions.length > 0 ? (
                    <>
                      <TableView categories={categories} />
                      <ListView categories={categories} />
                    </>
                  ) : (
                    <EmptyStateScreen
                      name="transactions"
                      namespace="apps.wallet"
                    />
                  )}
                </Scrollbar>
              </div>
            )}
          </QueryWrapper>
        )}
      </QueryWrapper>
    </DashboardItem>
  )
}

export default TransactionsCard
