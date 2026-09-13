import { Flex, Icon, Text } from '@lifeforge/ui'

import { useTransactionDetails } from '../TransactionDetailsContext'
import DetailItem from './DetailItem'

function TransactionTypeSection() {
  const transaction = useTransactionDetails()

  return (
    <DetailItem icon="tabler:exchange" label="transactionType">
      <Flex align="center" gap="xs">
        <Icon
          color={
            transaction.type === 'income'
              ? 'green-500'
              : transaction.type === 'expenses'
                ? 'red-500'
                : 'blue-500'
          }
          icon={
            {
              income: 'tabler:login-2',
              expenses: 'tabler:logout',
              transfer: 'tabler:arrows-exchange'
            }[transaction.type]
          }
          size="1.25rem"
        />
        <Text>
          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
        </Text>
      </Flex>
    </DetailItem>
  )
}

export default TransactionTypeSection
