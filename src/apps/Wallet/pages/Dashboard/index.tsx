import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  LogarithmicScale,
  PointElement,
  Title,
  Tooltip
} from 'chart.js'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import {
  Button,
  FAB,
  MenuItem,
  ModuleHeader,
  ModuleWrapper
} from '@lifeforge/ui'

import { useWalletContext } from '@apps/Wallet/providers/WalletProvider'

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

function WalletDashboard() {
  const navigate = useNavigate()
  const { t } = useTranslation(['common.buttons', 'apps.wallet'])
  const { isAmountHidden, toggleAmountVisibility } = useWalletContext()

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
                item: t('apps.wallet:items.transaction')
              })}
            </Button>
            <MenuItems
              transition
              anchor="bottom end"
              className="bg-bg-100 dark:bg-bg-800 mt-2 min-w-[var(--button-width)] overflow-hidden overscroll-contain rounded-md shadow-lg outline-hidden transition duration-100 ease-out focus:outline-hidden data-closed:scale-95 data-closed:opacity-0"
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
              namespace="apps.wallet"
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
        <IncomeExpenseCard icon="tabler:login-2" title="Income" />
        <IncomeExpenseCard icon="tabler:logout-2" title="Expenses" />
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
          className="bg-bg-100 dark:bg-bg-800 w-48 overflow-hidden overscroll-contain rounded-md shadow-lg outline-hidden transition duration-100 ease-out [--anchor-gap:8px] focus:outline-hidden data-closed:scale-95 data-closed:opacity-0"
        >
          <MenuItem
            icon="tabler:plus"
            namespace="apps.wallet"
            text="Add Manually"
            onClick={() => {
              navigate('/wallet/transactions#new')
            }}
          />
          <MenuItem
            icon="tabler:scan"
            namespace="apps.wallet"
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
