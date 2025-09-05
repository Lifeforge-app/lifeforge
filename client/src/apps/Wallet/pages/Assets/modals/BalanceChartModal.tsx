import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip
} from 'chart.js'
import { ModalHeader, WithQuery } from 'lifeforge-ui'
import { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import { usePersonalization } from 'shared'
import tinycolor from 'tinycolor2'

import type { WalletAsset } from '@apps/Wallet/hooks/useWalletData'
import numberToCurrency from '@apps/Wallet/utils/numberToCurrency'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

function BalanceChartModal({
  data: { initialData },
  onClose
}: {
  data: {
    initialData: WalletAsset
  }
  onClose: () => void
}) {
  const { derivedThemeColor } = usePersonalization()

  const assetBalanceQuery = useQuery(
    forgeAPI.wallet.assets.getAssetAccumulatedBalance
      .input({
        id: initialData.id
      })
      .queryOptions()
  )

  const chartData = useMemo(() => {
    if (!assetBalanceQuery.data) return null

    const sortedEntries = Object.entries(assetBalanceQuery.data).sort(
      ([a], [b]) => new Date(a).getTime() - new Date(b).getTime()
    )

    const labels = sortedEntries.map(([date]) =>
      new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    )

    const data = sortedEntries.map(([, balance]) => balance)

    return {
      labels,
      datasets: [
        {
          label: 'Balance',
          data,
          borderColor: derivedThemeColor,
          backgroundColor: tinycolor(derivedThemeColor)
            .setAlpha(0.1)
            .toRgbString(),
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointHoverBackgroundColor: derivedThemeColor,
          pointHoverBorderColor: derivedThemeColor,
          pointRadius: 0,
          pointHoverRadius: 6
        }
      ]
    }
  }, [assetBalanceQuery.data])

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 1,
          callbacks: {
            label: (context: any) => `RM ${numberToCurrency(context.parsed.y)}`
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          border: {
            display: false
          }
        },
        y: {
          grid: {
            color: 'rgba(156, 163, 175, 0.2)'
          },
          border: {
            display: false
          },
          ticks: {
            callback: (value: any) => `RM ${numberToCurrency(value)}`
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index' as const
      }
    }),
    []
  )

  return (
    <div className="min-w-[50vw]">
      <ModalHeader
        appendTitle={
          <p className="hidden truncate sm:block"> - {initialData.name}</p>
        }
        icon="tabler:chart-line"
        namespace="apps.wallet"
        title="assetsBalanceChart"
        onClose={onClose}
      />
      <WithQuery query={assetBalanceQuery}>
        {assetBalance => (
          <div className="p-6">
            {chartData && Object.keys(assetBalance).length > 0 ? (
              <div className="h-96">
                <Line data={chartData} options={chartOptions} />
              </div>
            ) : (
              <div className="flex-center h-96 flex-col gap-3 text-gray-500">
                <div className="text-6xl">📊</div>
                <div className="text-lg font-medium">No Balance History</div>
                <div className="text-sm">
                  Balance data will appear here once transactions are recorded.
                </div>
              </div>
            )}
          </div>
        )}
      </WithQuery>
    </div>
  )
}

export default BalanceChartModal
