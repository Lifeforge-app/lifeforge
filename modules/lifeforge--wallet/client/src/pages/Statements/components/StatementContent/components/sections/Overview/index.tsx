import { Text } from '@lifeforge/ui'

import AssetsTable from './components/AssetsTable'
import IncomeExpensesTable from './components/IncomeExpensesTable'
import OverviewSummary from './components/OverviewSummary'

function Overview({ month, year }: { month: number; year: number }) {
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
        <Text color={{ base: 'custom-500', print: 'custom-600' }}>01. </Text>
        Overview
      </Text>
      <OverviewSummary month={month} year={year} />
      <Text
        as="h2"
        mt="3xl"
        size={{ base: '2xl', print: 'lg' }}
        tracking="widest"
        transform="uppercase"
        weight="semibold"
      >
        <Text>1.1 </Text>
        Assets
      </Text>
      <AssetsTable month={month} year={year} />
      {(['income', 'expenses'] as const).map(type => (
        <IncomeExpensesTable key={type} month={month} type={type} year={year} />
      ))}
    </>
  )
}

export default Overview
