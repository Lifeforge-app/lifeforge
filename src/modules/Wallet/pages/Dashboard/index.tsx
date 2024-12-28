import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  LogarithmicScale,
  PointElement,
  Title,
  Tooltip
} from 'chart.js'
import React from 'react'
import { useNavigate } from 'react-router'
import Button from '@components/ButtonsAndInputs/Button'
import FAB from '@components/ButtonsAndInputs/FAB'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import { useWalletContext } from '@providers/WalletProvider'
import AssetsBalanceCard from './components/AssetsBalanceCard'
import ExpensesBreakdownCard from './components/ExpensesBreakdownCard'
import IncomeExpenseCard from './components/IncomeExpensesCard'
import StatisticChardCard from './components/StatisticChartCard'
import TransactionsCard from './components/TransactionsCard'
import TransactionsCountCard from './components/TransactionsCountCard'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LogarithmicScale
)

function WalletDashboard(): React.ReactElement {
  const navigate = useNavigate()
  const { incomeExpenses, isAmountHidden, toggleAmountVisibility } =
    useWalletContext()

  return (
    <ModuleWrapper>
      <ModuleHeader
        icon="tabler:wallet"
        title="Wallet"
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
        hamburgerMenuItems={
          <>
            <MenuItem
              text="Hide Amount"
              icon="tabler:eye-off"
              onClick={() => {
                toggleAmountVisibility(!isAmountHidden)
              }}
              isToggled={isAmountHidden}
            />
          </>
        }
      />
      <div className="mt-6 flex size-full grid-cols-3 grid-rows-6 flex-col gap-4 pb-8 xl:grid">
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
        <TransactionsCountCard />
        <TransactionsCard />
        <ExpensesBreakdownCard />
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
