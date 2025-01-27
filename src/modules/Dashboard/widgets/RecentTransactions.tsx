import React from 'react'
import DashboardItem from '@components/utilities/DashboardItem'

export default function RecentTransactions(): React.ReactElement {
  return (
    <DashboardItem
      icon="tabler:history"
      title="Recent Transactions"
    ></DashboardItem>
  )
}
