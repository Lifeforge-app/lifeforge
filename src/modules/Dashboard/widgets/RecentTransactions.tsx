import React from 'react'

import { DashboardItem } from '@lifeforge/ui'

export default function RecentTransactions(): React.ReactElement {
  return (
    <DashboardItem
      icon="tabler:history"
      title="Recent Transactions"
    ></DashboardItem>
  )
}
