import React from 'react'
import DashboardItem from '@components/Miscellaneous/DashboardItem'

export default function PomodoroTimer(): React.ReactElement {
  return (
    <DashboardItem
      icon="tabler:clock-bolt"
      title="Pomodoro Timer"
    ></DashboardItem>
  )
}
