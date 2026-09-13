import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  Box,
  Card,
  EmptyStateScreen,
  Flex,
  Stack,
  Text,
  Widget,
  WithQuery,
  surface,
  usePersonalization
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import getChartScale from '@/utils/getChartScale'
import numberToCurrency from '@/utils/numberToCurrency'

import RangeSelector from './components/RangeSelector'

function StatisticChardCard() {
  const { t } = useModuleTranslation()
  const { bgTempPalette, derivedTheme } = usePersonalization()
  const [range, setRange] = useState<'week' | 'month' | 'ytd'>('week')

  const chartDataQuery = useQuery(
    forgeAPI.analytics.getChartData.input({ range }).queryOptions()
  )

  const data = chartDataQuery.data ?? []

  const chartScale = useMemo(() => {
    const allValues = data.flatMap(d => [d.income, Math.abs(d.expenses)])

    return getChartScale(allValues, { startFromZero: false })
  }, [data])

  const CustomTooltip = ({
    active,
    payload,
    label
  }: {
    active?: boolean
    payload?: Array<{
      value: number
      name: string
      stroke: string
    }>
    label?: string
  }) => {
    if (active && payload && payload.length) {
      return (
        <Card>
          <Stack>
            <Text mb="sm" weight="medium">
              {label}
            </Text>
            <Stack gap="xs">
              {payload.map((entry, index) => (
                <Flex key={index} align="center" gap="lg" justify="between">
                  <Flex align="center" gap="sm">
                    <Box
                      height="0.625rem"
                      r="full"
                      style={{
                        backgroundColor: entry.stroke
                      }}
                      width="0.625rem"
                    />
                    <Text color="muted">{entry.name}:</Text>
                  </Flex>
                  <Text style={{ color: entry.stroke }} weight="semibold">
                    RM {numberToCurrency(Math.abs(entry.value))}
                  </Text>
                </Flex>
              ))}
            </Stack>
            <Box bg={surface.light} height="1px" width="100%" />
            <Flex align="center" gap="lg" justify="between">
              <Text color="muted" weight="medium">
                Difference:
              </Text>
              <Text weight="semibold">
                RM{' '}
                {(payload[0]?.value ?? 0) + (payload[1]?.value ?? 0) < 0
                  ? '('
                  : ''}
                {numberToCurrency(
                  Math.abs((payload[0]?.value ?? 0) + (payload[1]?.value ?? 0))
                )}
                {(payload[0]?.value ?? 0) + (payload[1]?.value ?? 0) < 0
                  ? ')'
                  : ''}
              </Text>
            </Flex>
          </Stack>
        </Card>
      )
    }

    return null
  }

  return (
    <Widget
      actionComponent={
        <RangeSelector
          display={{ base: 'none', sm: 'block' }}
          range={range}
          setRange={setRange}
        />
      }
      gridColumnSpan={{ xl: 2 }}
      gridRowSpan={2}
      icon="tabler:chart-dots"
      title="Statistics"
    >
      <RangeSelector
        display={{ sm: 'none' }}
        range={range}
        setRange={setRange}
      />
      <Flex centered flex="1" height="100%" minHeight="24rem" width="100%">
        <WithQuery query={chartDataQuery}>
          {chartData =>
            chartData.length === 0 ? (
              <EmptyStateScreen
                message={{
                  id: 'transactions'
                }}
              />
            ) : (
              <ResponsiveContainer height="100%" width="100%">
                <ComposedChart
                  barGap={0}
                  data={data}
                  margin={{ top: 0, bottom: 20, left: 20, right: 0 }}
                >
                  <CartesianGrid
                    stroke={
                      bgTempPalette[derivedTheme === 'dark' ? '800' : '200']
                    }
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    axisLine={false}
                    dataKey="date"
                    tick={{ fill: 'currentColor', fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis
                    axisLine={false}
                    domain={['auto', 'auto']}
                    scale={chartScale}
                    tick={{ fill: 'currentColor', fontSize: 12 }}
                    tickFormatter={value =>
                      `${numberToCurrency(Math.abs(value))}`
                    }
                    tickLine={false}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: 'rgba(156, 163, 175, 0.1)' }}
                  />
                  <Bar
                    dataKey="income"
                    fill="rgba(34,197,94,0.2)"
                    name="Income"
                    radius={[8, 8, 8, 8]}
                    stroke="rgb(34 197 94)"
                    strokeWidth={2}
                  />
                  <Bar
                    dataKey="expenses"
                    fill="rgba(239,68,68,0.2)"
                    name="Expenses"
                    radius={[8, 8, 8, 8]}
                    stroke="rgb(239 68 68)"
                    strokeWidth={2}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )
          }
        </WithQuery>
      </Flex>
      <Flex centered gap="2xl">
        <Flex align="center" gap="sm">
          <Box bg="green-500" height="0.75rem" r="full" width="0.75rem" />
          <Text size="sm">{t('transactionTypes.income')}</Text>
        </Flex>
        <Flex align="center" gap="sm">
          <Box bg="red-500" height="0.75rem" r="full" width="0.75rem" />
          <Text size="sm">{t('transactionTypes.expenses')}</Text>
        </Flex>
      </Flex>
    </Widget>
  )
}

export default StatisticChardCard
