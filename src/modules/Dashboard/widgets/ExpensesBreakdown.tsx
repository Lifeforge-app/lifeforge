import React from 'react'
import DashboardItem from '@components/Miscellaneous/DashboardItem'

export default function ExpensesBreakdown(): React.ReactElement {
  return (
    <DashboardItem
      icon="tabler:chart-pie"
      title="Expenses Breakdown"
    ></DashboardItem>
  )
}
