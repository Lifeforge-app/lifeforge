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
import {
  Button,
  ContextMenu,
  ContextMenuItem,
  FAB,
  ModuleHeader
} from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { useWalletStore } from '@apps/Wallet/stores/useWalletStore'

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

  const { isAmountHidden, toggleAmountVisibility } = useWalletStore()

  return (
    <>
      <ModuleHeader
        actionButton={
          <ContextMenu
            buttonComponent={
              <Button
                className="hidden md:flex"
                icon="tabler:plus"
                tProps={{
                  item: t('apps.wallet:items.transaction')
                }}
                onClick={() => {}}
              >
                new
              </Button>
            }
            classNames={{ wrapper: 'hidden md:block' }}
          >
            <ContextMenuItem
              icon="tabler:plus"
              label="Add Manually"
              namespace="apps.wallet"
              onClick={() => {
                navigate('/wallet/transactions#new')
              }}
            />
            <ContextMenuItem
              icon="tabler:scan"
              label="Scan Receipt"
              namespace="apps.wallet"
              onClick={() => {
                navigate('/wallet/transactions#scan')
              }}
            />
          </ContextMenu>
        }
        contextMenuProps={{
          children: (
            <ContextMenuItem
              checked={isAmountHidden}
              icon="tabler:eye-off"
              label="Hide Amount"
              namespace="apps.wallet"
              onClick={() => {
                toggleAmountVisibility()
              }}
            />
          )
        }}
      />
      <div className="flex size-full grid-cols-3 grid-rows-6 flex-col gap-3 pb-8 xl:grid">
        <IncomeExpenseCard icon="tabler:login-2" title="Income" />
        <IncomeExpenseCard icon="tabler:logout-2" title="Expenses" />
        <AssetsBalanceCard />
        <StatisticChardCard />
        <TransactionsCountCard />
        <TransactionsCard />
        <ExpensesBreakdownCard />
      </div>
      <ContextMenu
        buttonComponent={<FAB className="static!" isibilityBreakpoint="md" />}
        classNames={{
          wrapper: 'fixed right-6 bottom-6'
        }}
      >
        <ContextMenuItem
          icon="tabler:plus"
          label="Add Manually"
          namespace="apps.wallet"
          onClick={() => {
            navigate('/wallet/transactions#new')
          }}
        />
        <ContextMenuItem
          icon="tabler:scan"
          label="Scan Receipt"
          namespace="apps.wallet"
          onClick={() => {
            navigate('/wallet/transactions#scan')
          }}
        />
      </ContextMenu>
    </>
  )
}

export default WalletDashboard
