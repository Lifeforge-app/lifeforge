import dayjs from 'dayjs'
import { useMemo } from 'react'

import { Box, Flex, Icon, Text } from '@lifeforge/ui'

import { useWalletData } from '@/hooks/useWalletData'
import TransactionAmount from '@/pages/Dashboard/components/TransactionsCard/components/TransactionAmount'

import type { WalletTransaction } from '../../..'

function Header({ transaction }: { transaction: WalletTransaction }) {
  const { categoriesQuery } = useWalletData()

  const category = useMemo(
    () =>
      transaction.type === 'transfer'
        ? null
        : categoriesQuery.data?.find(
            category => category.id === transaction.category
          ),
    [transaction, categoriesQuery.data]
  )

  return (
    <Flex centered align="center" direction="column">
      {category && (
        <Box
          mb="lg"
          p="lg"
          r="lg"
          style={{
            backgroundColor: category.color + (category.color ? '50' : ''),
            color: category.color,
            borderColor: category.color + '20'
          }}
        >
          <Icon icon={category.icon ?? ''} size="2rem" />
        </Box>
      )}
      {transaction.type === 'transfer' && (
        <Box
          mb="lg"
          p="lg"
          r="lg"
          style={{ backgroundColor: 'rgba(59,130,246,0.2)' }}
        >
          <Icon color="blue-500" icon="tabler:arrows-exchange" size="2rem" />
        </Box>
      )}
      <Text align="center" mb="sm" size="4xl" weight="medium">
        <TransactionAmount
          amount={transaction.amount}
          type={transaction.type}
        />
      </Text>
      <Text align="center" size="lg">
        {transaction.type === 'transfer'
          ? 'Intra-Asset Transfer'
          : transaction.particulars}
      </Text>
      <Text align="center" color="muted" mt="sm">
        {dayjs(transaction.date).format('dddd, D MMM YYYY')}
      </Text>
    </Flex>
  )
}

export default Header
