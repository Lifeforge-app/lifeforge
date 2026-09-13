import { Text } from '@lifeforge/ui'

import TransactionList from './components/TransactionList'
import TransactionsSummary from './components/TransactionsSummary'

function Transactions({ month, year }: { month: number; year: number }) {
  return (
    <>
      <Text
        as="h2"
        mt="3xl"
        size={{ base: '3xl', print: '2xl' }}
        tracking="widest"
        transform="uppercase"
        weight="semibold"
      >
        <Text color={{ base: 'custom-500', print: 'custom-600' }}>02. </Text>
        Transactions
      </Text>
      <TransactionsSummary month={month} year={year} />
      {['income', 'expenses', 'transfer'].map(type => (
        <TransactionList
          key={type}
          month={month}
          type={type as 'income' | 'expenses' | 'transfer'}
          year={year}
        />
      ))}
    </>
  )
}

export default Transactions
