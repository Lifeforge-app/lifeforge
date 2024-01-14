import React, { useContext } from 'react'
import { Icon } from '@iconify/react'

import StorageStatus from './modules/StorageStatus'
import CodeTime from './modules/CodeTime'
import WalletBalance from './modules/WalletBalance'
import TodaysEvent from './modules/TodaysEvent'
import Calendar from './modules/Calendar'
import TodoList from './modules/TodoList'

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
import ModuleHeader from '../../components/ModuleHeader'
import { AuthContext } from '../../providers/AuthProvider'

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

function Dashboard(): React.JSX.Element {
  const { userData } = useContext(AuthContext)

  return (
    <section className="flex w-full flex-col overflow-y-auto px-12">
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
        <div className="mt-6 grid w-full grid-cols-4 grid-rows-3 gap-6">
          <StorageStatus />
          <CodeTime />
          <TodaysEvent />
          <WalletBalance />
          <TodoList />
          <Calendar />
        </div>
      </div>
    </section>
  )
}

export default Dashboard
