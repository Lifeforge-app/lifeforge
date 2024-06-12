import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LogarithmicScale
} from 'chart.js'
import React from 'react'
import { useNavigate } from 'react-router'
import Button from '@components/ButtonsAndInputs/Button'
import FAB from '@components/ButtonsAndInputs/FAB'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import { useWalletContext } from '@providers/WalletProvider'
import AssetsBalanceCard from './components/AssetsBalanceCard'
import ExpensesBreakdownCard from './components/ExpensesBreakdownCard'
import IncomeExpenseCard from './components/IncomeExpensesCard'
import StatisticChardCard from './components/StatisticChardCard'
import TransactionsCard from './components/TransactionsCard'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LogarithmicScale
)

function WalletDashboard(): React.ReactElement {
  const navigate = useNavigate()
  const { incomeExpenses } = useWalletContext()

  return (
    <ModuleWrapper>
      <ModuleHeader
        title="Wallet"
        desc="..."
        actionButton={
          <Button
            className="hidden md:flex"
            onClick={() => {
              navigate('/wallet/transactions#new')
            }}
            icon="tabler:plus"
          >
            Add Transaction
          </Button>
        }
      />
      <div className="mt-6 flex size-full grid-cols-3 grid-rows-[repeat(6,minmax(200px,1fr))] flex-col gap-4 overflow-y-auto pb-8 xl:grid">
        <IncomeExpenseCard
          title="Income"
          icon="tabler:login-2"
          data={incomeExpenses}
        />
        <IncomeExpenseCard
          title="Expenses"
          icon="tabler:logout-2"
          data={incomeExpenses}
        />
        <AssetsBalanceCard />
        <StatisticChardCard />
        <ExpensesBreakdownCard />
        <TransactionsCard />
      </div>
      <FAB
        onClick={() => {
          navigate('/wallet/transactions#new')
        }}
        hideWhen="md"
      />
    </ModuleWrapper>
  )
}

export default WalletDashboard
