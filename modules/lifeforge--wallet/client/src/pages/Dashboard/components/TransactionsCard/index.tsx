import { Link } from 'react-router'

import {
  Button,
  EmptyStateScreen,
  Flex,
  Icon,
  Scrollbar,
  Widget,
  WithQuery
} from '@lifeforge/ui'

import { useWalletData } from '@/hooks/useWalletData'

import TransactionList from './components/TransactionList'

function TransactionsCard() {
  const { transactionsQuery } = useWalletData()

  return (
    <Widget
      actionComponent={
        <Button as={Link} p="xs" to="/wallet/transactions" variant="plain">
          <Icon icon="tabler:chevron-right" />
        </Button>
      }
      gridColumnSpan={{ xl: 2 }}
      gridRowSpan={6}
      icon="tabler:list"
      minHeight="0"
      title="Recent Transactions"
    >
      <WithQuery query={transactionsQuery}>
        {transactions => (
          <Flex height="100%" minHeight="32rem" width="100%">
            <Scrollbar>
              {transactions.length > 0 ? (
                <TransactionList />
              ) : (
                <EmptyStateScreen
                  icon="tabler:wallet-off"
                  message={{
                    id: 'transactions'
                  }}
                />
              )}
            </Scrollbar>
          </Flex>
        )}
      </WithQuery>
    </Widget>
  )
}

export default TransactionsCard
