import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler
} from 'chart.js'
import React from 'react'

import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import { useAuthContext } from '@providers/AuthProvider'
import Calendar from './modules/Calendar'
import CodeTime from './modules/CodeTime'
import StorageStatus from './modules/StorageStatus'
import TodaysEvent from './modules/TodaysEvent'
import TodoList from './modules/TodoList'
import WalletBalance from './modules/WalletBalance'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler
)

function Dashboard(): React.ReactElement {
  const { userData } = useAuthContext()

  return (
    <ModuleWrapper>
      <div className="mb-8 flex w-full flex-col">
        <ModuleHeader
          title="Dashboard"
          desc={
            <>
              Good to see you here,{' '}
              <span className="text-custom-500">{userData?.name}</span>!
            </>
          }
        />
        <div className="mt-6 flex w-full grid-cols-4 grid-rows-3 flex-col gap-6 lg:grid">
          <StorageStatus />
          <CodeTime />
          <TodaysEvent />
          <WalletBalance />
          <TodoList />
          <Calendar />
        </div>
      </div>
    </ModuleWrapper>
  )
}

export default Dashboard
