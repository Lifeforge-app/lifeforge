import { Menu, MenuButton, MenuItems } from '@headlessui/react'
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
import { Button , FAB } from '@components/buttons'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
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
          <Menu as="div" className="relative z-50 hidden md:block">
            <Button
              onClick={() => {}}
              icon="tabler:plus"
              className="hidden md:flex"
              as={MenuButton}
            >
              Add Transaction
            </Button>
            <MenuItems
              transition
              anchor="bottom end"
              className="mt-2 min-w-[var(--button-width)] overflow-hidden overscroll-contain rounded-md bg-bg-100 shadow-lg outline-none transition duration-100 ease-out focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 dark:bg-bg-800"
            >
              <MenuItem
                onClick={() => {
                  navigate('/wallet/transactions#new')
                }}
                icon="tabler:plus"
                text="Add Manually"
              />
              <MenuItem
                onClick={() => {
                  navigate('/wallet/transactions#scan')
                }}
                icon="tabler:scan"
                text="Scan Receipt"
              />
            </MenuItems>
          </Menu>
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
      <Menu>
        <FAB as={MenuButton} hideWhen="md" />
        <MenuItems
          transition
          anchor="bottom end"
          className="w-48 overflow-hidden overscroll-contain rounded-md bg-bg-100 shadow-lg outline-none transition duration-100 ease-out [--anchor-gap:8px] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 dark:bg-bg-800"
        >
          <MenuItem
            onClick={() => {
              navigate('/wallet/transactions#new')
            }}
            icon="tabler:plus"
            text="Add Manually"
          />
          <MenuItem
            onClick={() => {
              navigate('/wallet/transactions#scan')
            }}
            icon="tabler:scan"
            text="Scan Receipt"
          />
        </MenuItems>
      </Menu>
    </ModuleWrapper>
  )
}

export default WalletDashboard
