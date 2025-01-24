import React from 'react'
import DashboardItem from '@components/utilities/DashboardItem'

export default function PomodoroTimer(): React.ReactElement {
  return (
    <DashboardItem
      icon="tabler:clock-bolt"
      title="Pomodoro Timer"
    ></DashboardItem>
  )
}
