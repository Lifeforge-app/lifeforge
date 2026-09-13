import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts'

import { Box, Flex, Text, WithQuery, usePersonalization } from '@lifeforge/ui'

import type { WalletAsset } from '@/hooks/useWalletData'
import { forgeAPI } from '@/manifest'
import getChartScale from '@/utils/getChartScale'

function AssetBalanceChart({
  asset,
  rangeMode
}: {
  asset: WalletAsset
  rangeMode: 'week' | 'month' | 'quarter' | 'year' | 'all'
}) {
  const { derivedThemeColor } = usePersonalization()

  const assetBalanceQuery = useQuery(
    forgeAPI.assets.getAssetAccumulatedBalance
      .input({
        id: asset.id,
        rangeMode
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

  return (
    <Box height="3rem" width={{ base: '50%', md: '10rem' }}>
      <WithQuery
        loaderSize="1em"
        query={assetBalanceQuery}
        showRetryButton={false}
      >
        {() =>
          chartData.length === 0 ? (
            <Flex centered color="muted" height="100%" width="100%">
              <Text color="muted">No data available</Text>
            </Flex>
          ) : (
            <ResponsiveContainer height="100%" width="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient
                    id={`colorBalance-${asset.id}`}
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={derivedThemeColor}
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="95%"
                      stopColor={derivedThemeColor}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <YAxis hide domain={chartDomain} scale={chartScale} />
                <Area
                  dataKey="balance"
                  dot={false}
                  fill={`url(#colorBalance-${asset.id})`}
                  stroke={derivedThemeColor}
                  strokeWidth={2}
                  type="monotone"
                />
              </AreaChart>
            </ResponsiveContainer>
          )
        }
      </WithQuery>
    </Box>
  )
}

export default AssetBalanceChart
