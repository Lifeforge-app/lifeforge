import React from 'react'

import { DashboardItem } from '@lifeforge/ui'

export default function ExpensesBreakdown(): React.ReactElement {
  return (
    <DashboardItem
      icon="tabler:chart-pie"
      title="Expenses Breakdown"
    ></DashboardItem>
  )
}
