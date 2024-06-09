import { Icon } from '@iconify/react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import React from 'react'
import { useNavigate } from 'react-router'
import Button from '@components/ButtonsAndInputs/Button'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import useFetch from '@hooks/useFetch'
import { type IWalletIncomeExpenses } from '@typedec/Wallet'
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
  ArcElement
)

function WalletDashboard(): React.ReactElement {
  const navigate = useNavigate()
  const [incomeExpenses] = useFetch<IWalletIncomeExpenses>(
    `wallet/transactions/income-expenses/${new Date().getFullYear()}/${
      new Date().getMonth() + 1
    }`
  )

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
      <button
        onClick={() => {
          navigate('/wallet/transactions#new')
        }}
        className="absolute bottom-6 right-6 z-10 flex items-center gap-2 rounded-lg bg-custom-500 p-4 font-semibold uppercase tracking-wider text-bg-100 shadow-lg hover:bg-custom-600 dark:text-bg-800 md:hidden"
      >
        <Icon icon="tabler:plus" className="size-6 shrink-0 transition-all" />
      </button>
    </ModuleWrapper>
  )
}

export default WalletDashboard
