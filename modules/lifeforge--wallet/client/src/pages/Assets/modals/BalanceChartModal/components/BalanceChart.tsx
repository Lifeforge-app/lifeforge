import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

import {
  Box,
  Card,
  EmptyStateScreen,
  Flex,
  Text,
  WithQuery,
  usePersonalization
} from '@lifeforge/ui'

import type { WalletAsset } from '@/hooks/useWalletData'
import { forgeAPI } from '@/manifest'
import getChartScale from '@/utils/getChartScale'
import numberToCurrency from '@/utils/numberToCurrency'

import type { RANGE_MODE } from '..'

function BalanceChart({
  asset,
  rangeMode,
  startDate,
  endDate
}: {
  asset: WalletAsset
  rangeMode: (typeof RANGE_MODE)[number]
  startDate: Date | null
  endDate: Date | null
}) {
  const { derivedThemeColor } = usePersonalization()

  const assetBalanceQuery = useQuery(
    forgeAPI.assets.getAssetAccumulatedBalance
      .input({
        id: asset.id,
        rangeMode,
        startDate:
          rangeMode === 'custom'
            ? startDate
              ? dayjs(startDate).format('YYYY-MM-DD')
              : undefined
            : undefined,
        endDate:
          rangeMode === 'custom'
            ? endDate
              ? dayjs(endDate).format('YYYY-MM-DD')
              : undefined
            : undefined
      })
      .queryOptions()
  )

  const chartData = useMemo(() => {
    if (!assetBalanceQuery.data) return []

    const sortedEntries = Object.entries(assetBalanceQuery.data.balances).sort(
      ([a], [b]) => new Date(a).getTime() - new Date(b).getTime()
    )

    const years = new Set(
      sortedEntries.map(([date]) => new Date(date).getFullYear())
    )

    const includeYear = years.size > 1

    return sortedEntries.map(([date, balance]) => ({
      date: new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        ...(includeYear && { year: '2-digit' })
      }),
      balance
    }))
  }, [assetBalanceQuery.data])

  const chartScale = useMemo(
    () => getChartScale(chartData.map(d => d.balance)),
    [chartData]
  )

  const chartDomain = useMemo(() => {
    if (chartScale === 'log') {
      const minValue = Math.min(...chartData.map(d => d.balance))

      return [Math.max(minValue * 0.9, 1), 'auto'] as [number, 'auto']
    }

    return [0, 'auto'] as [number, 'auto']
  }, [chartScale, chartData])

  const CustomTooltip = ({
    active,
    payload,
    label
  }: {
    active?: boolean
    payload?: Array<{
      value: number
      payload: { date: string; balance: number }
    }>
    label?: string
  }) => {
    if (active && payload && payload.length) {
      return (
        <Card
          p="md"
          style={{
            border: '1px solid var(--color-bg-200)'
          }}
        >
          <Text color="muted" mb="xs" weight="medium">
            {label}
          </Text>
          <Flex align="baseline" gap="xs">
            <Text color="muted">Balance:</Text>
            <Text size="lg" weight="semibold">
              RM {numberToCurrency(payload[0].value)}
            </Text>
          </Flex>
        </Card>
      )
    }

    return null
  }

  return (
    <WithQuery query={assetBalanceQuery}>
      {() =>
        chartData.length > 0 ? (
          <Box height="32rem">
            <ResponsiveContainer height="100%" width="100%">
              <AreaChart data={chartData} margin={{ bottom: 50 }}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" x2="0" y1="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={derivedThemeColor}
                      stopOpacity={0.1}
                    />
                    <stop
                      offset="95%"
                      stopColor={derivedThemeColor}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="rgba(156, 163, 175, 0.2)"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  angle={-45}
                  axisLine={false}
                  dataKey="date"
                  textAnchor="end"
                  tick={{ fill: 'currentColor' }}
                  tickLine={false}
                />
                <YAxis
                  axisLine={false}
                  domain={chartDomain}
                  scale={chartScale}
                  tick={{ fill: 'currentColor' }}
                  tickFormatter={value => `${numberToCurrency(value)}`}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  activeDot={{
                    r: 6,
                    fill: derivedThemeColor,
                    stroke: derivedThemeColor
                  }}
                  dataKey="balance"
                  dot={false}
                  fill="url(#colorBalance)"
                  stroke={derivedThemeColor}
                  strokeWidth={2}
                  type="monotone"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <EmptyStateScreen
            message={{
              id: 'transactions'
            }}
          />
        )
      }
    </WithQuery>
  )
}

export default BalanceChart
