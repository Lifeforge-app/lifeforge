import { useQuery } from '@tanstack/react-query'

import type { InferOutput } from '@lifeforge/api'
import {
  ContentWrapperWithSidebar,
  EmptyStateScreen,
  LayoutWithSidebar,
  ModuleHeader,
  Stack,
  WithQuery
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import HeaderMenu from './components/HeaderMenu'
import InnerHeader from './components/InnerHeader'
import SearchBar from './components/SearchBar'
import Sidebar from './components/Sidebar'
import TransactionCreationMenu from './components/TransactionCreationMenu'
import TransactionList from './components/TransactionList'

export type WalletTransaction = InferOutput<
  typeof forgeAPI.transactions.list
>[number]

export type WalletCategory = InferOutput<
  typeof forgeAPI.categories.list
>[number]

function Transactions() {
  const transactionsQuery = useQuery(forgeAPI.transactions.list.queryOptions())

  return (
    <>
      <ModuleHeader
        icon="tabler:arrows-exchange"
        title="Transactions"
        trailing={
          <>
            <TransactionCreationMenu variant="desktop" />
            <HeaderMenu />
          </>
        }
      />
      <LayoutWithSidebar>
        <Sidebar />
        <ContentWrapperWithSidebar>
          <InnerHeader />
          <SearchBar />
          <Stack gap="md" height="100%" my="lg" width="100%">
            <WithQuery query={transactionsQuery}>
              {transactions =>
                transactions.length > 0 ? (
                  <TransactionList />
                ) : (
                  <EmptyStateScreen
                    icon="tabler:wallet-off"
                    message={{
                      id: 'transactions'
                    }}
                  />
                )
              }
            </WithQuery>
            <TransactionCreationMenu variant="mobile" />
          </Stack>
        </ContentWrapperWithSidebar>
      </LayoutWithSidebar>
    </>
  )
}

export default Transactions
