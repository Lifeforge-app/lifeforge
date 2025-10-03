import { Icon } from '@iconify/react'
import { useWalletData } from '@modules/wallet/client/hooks/useWalletData'
import {
  DashboardItem,
  EmptyStateScreen,
  Scrollbar,
  WithQuery
} from 'lifeforge-ui'
import { Link } from 'react-router'

import ListView from './views/ListView'
import TableView from './views/TableView'

function TransactionsCard() {
  const { transactionsQuery } = useWalletData()

  return (
    <DashboardItem
      className="col-span-2 row-span-4"
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
      <WithQuery query={transactionsQuery}>
        {transactions => (
          <div className="size-full min-h-96 xl:min-h-0">
            <Scrollbar>
              {transactions.length > 0 ? (
                <>
                  <TableView />
                  <ListView />
                </>
              ) : (
                <EmptyStateScreen name="transactions" namespace="apps.wallet" />
              )}
            </Scrollbar>
          </div>
        )}
      </WithQuery>
    </DashboardItem>
  )
}

export default TransactionsCard
