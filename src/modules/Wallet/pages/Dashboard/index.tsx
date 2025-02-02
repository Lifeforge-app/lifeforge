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
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { Button, FAB } from '@components/buttons'
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
  const { t } = useTranslation(['common.buttons', 'modules.wallet'])
  const { incomeExpenses, isAmountHidden, toggleAmountVisibility } =
    useWalletContext()

  return (
    <ModuleWrapper>
      <ModuleHeader
        actionButton={
          <Menu as="div" className="relative z-50 hidden md:block">
            <Button
              as={MenuButton}
              className="hidden md:flex"
              icon="tabler:plus"
              onClick={() => {}}
            >
              {t('common.buttons:new', {
                item: t('modules.wallet:items.transaction')
              })}
            </Button>
            <MenuItems
              transition
              anchor="bottom end"
              className="mt-2 min-w-[var(--button-width)] overflow-hidden overscroll-contain rounded-md bg-bg-100 shadow-lg outline-hidden transition duration-100 ease-out focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 dark:bg-bg-800"
            >
              <MenuItem
                icon="tabler:plus"
                text="Add Manually"
                onClick={() => {
                  navigate('/wallet/transactions#new')
                }}
              />
              <MenuItem
                icon="tabler:scan"
                text="Scan Receipt"
                onClick={() => {
                  navigate('/wallet/transactions#scan')
                }}
              />
            </MenuItems>
          </Menu>
        }
        hamburgerMenuItems={
          <>
            <MenuItem
              icon="tabler:eye-off"
              isToggled={isAmountHidden}
              text="Hide Amount"
              onClick={() => {
                toggleAmountVisibility(!isAmountHidden)
              }}
            />
          </>
        }
        icon="tabler:wallet"
        title="Wallet"
      />
      <div className="mt-6 flex size-full grid-cols-3 grid-rows-6 flex-col gap-4 pb-8 xl:grid">
        <IncomeExpenseCard
          data={incomeExpenses}
          icon="tabler:login-2"
          title="Income"
        />
        <IncomeExpenseCard
          data={incomeExpenses}
          icon="tabler:logout-2"
          title="Expenses"
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
          className="w-48 overflow-hidden overscroll-contain rounded-md bg-bg-100 shadow-lg outline-hidden transition duration-100 ease-out [--anchor-gap:8px] focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 dark:bg-bg-800"
        >
          <MenuItem
            icon="tabler:plus"
            namespace="modules.wallet"
            text="Add Manually"
            onClick={() => {
              navigate('/wallet/transactions#new')
            }}
          />
          <MenuItem
            icon="tabler:scan"
            namespace="modules.wallet"
            text="Scan Receipt"
            onClick={() => {
              navigate('/wallet/transactions#scan')
            }}
          />
        </MenuItems>
      </Menu>
    </ModuleWrapper>
  )
}

export default WalletDashboard
