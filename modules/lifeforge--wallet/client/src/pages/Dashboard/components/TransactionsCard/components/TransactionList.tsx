import dayjs from 'dayjs'

import {
  Box,
  Flex,
  Icon,
  Stack,
  Text,
  WithDivide,
  WithQuery
} from '@lifeforge/ui'

import { useWalletData } from '@/hooks/useWalletData'

import TransactionAmount from './TransactionAmount'
import TransactionParticular from './TransactionParticular'

function TransactionList() {
  const { transactionsQuery, categoriesQuery } = useWalletData()

  const categories = categoriesQuery.data ?? []

  return (
    <WithQuery query={transactionsQuery}>
      {transactions => (
        <Stack gap="none">
          {transactions.slice(0, 20).map(transaction => (
            <WithDivide key={transaction.id} axis="y">
              <Flex gap="xl" p="lg">
                <Flex align="center" gap="md" minWidth="0" width="100%">
                  <Box
                    p="sm"
                    r="md"
                    style={
                      transaction.type !== 'transfer'
                        ? {
                            backgroundColor:
                              categories.find(
                                category => category.id === transaction.category
                              )?.color + '20',
                            color: categories.find(
                              category => category.id === transaction.category
                            )?.color
                          }
                        : {
                            backgroundColor: 'rgba(59,130,246,0.2)',
                            color: 'rgb(59,130,246)'
                          }
                    }
                  >
                    <Icon
                      icon={
                        transaction.type === 'transfer'
                          ? 'tabler:transfer'
                          : (categories.find(
                              category => category.id === transaction.category
                            )?.icon ?? 'tabler:currency-dollar')
                      }
                      size="1.5rem"
                    />
                  </Box>
                  <Stack gap="none" minWidth="0" width="100%">
                    <Text truncate weight="semibold">
                      <TransactionParticular transaction={transaction} />
                    </Text>
                    <Text color="muted" size="sm">
                      {transaction.type[0].toUpperCase() +
                        transaction.type.slice(1)}
                    </Text>
                  </Stack>
                </Flex>
                <Stack gap="none">
                  <Text align="right">
                    <TransactionAmount
                      amount={transaction.amount}
                      type={transaction.type}
                    />
                  </Text>
                  <Text
                    align="right"
                    color="muted"
                    size="sm"
                    whiteSpace="nowrap"
                  >
                    {dayjs(transaction.date).format('MMM DD, YYYY')}
                  </Text>
                </Stack>
              </Flex>
            </WithDivide>
          ))}
        </Stack>
      )}
    </WithQuery>
  )
}

export default TransactionList
