import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useMemo, useState } from 'react'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import tinycolor from 'tinycolor2'

import {
  Box,
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

import IntervalSelector from './IntervalSelector'

dayjs.extend(duration)
dayjs.extend(relativeTime)

function CodeTimeTimeChart({ type }: { type: 'projects' | 'languages' }) {
  const { bgTempPalette, derivedTheme } = usePersonalization()
  const [lastFor, setLastFor] = useState<'7 days' | '30 days'>('7 days')

  const dataQuery = useQuery(
    forgeAPI.getLastXDays
      .input({
        days: lastFor.toString()
      })
      .queryOptions({
        refetchInterval: 60 * 1000
      })
  )

  const chartData = useMemo(() => {
    if (!dataQuery.data || !dataQuery.isSuccess) return []

    const days = dataQuery.data.map(e => dayjs(e.date).format('DD MMM'))

    const allItems = [
      ...new Set(dataQuery.data.flatMap(e => Object.keys(e[type])))
    ].sort() as (typeof type)[]

    return days.map((day, dayIndex) => {
      const dayData: {
        date: string
        total: number
      } & {
        [k in typeof type]: number
      } = {
        date: day,
        languages: 0,
        projects: 0,
        total: 0
      }

      allItems.forEach(item => {
        dayData[item] = dataQuery.data[dayIndex]?.[type]?.[item] || 0
      })

      dayData.total = dataQuery.data[dayIndex]?.total_minutes || 0

      return dayData
    })
  }, [dataQuery.data, dataQuery.isSuccess, type])

  const allItems = useMemo(() => {
    if (!dataQuery.data || !dataQuery.isSuccess) return []

    return [
      ...new Set(dataQuery.data.flatMap(e => Object.keys(e[type])))
    ].sort()
  }, [dataQuery.data, dataQuery.isSuccess, type])

  const CustomTooltip = ({
    active,
    payload,
    label
  }: {
    active?: boolean
    payload?: Array<{
      value: number
      name: string
      dataKey: string
      stroke: string
    }>
    label?: string
  }) => {
    if (active && payload && payload.length) {
      return (
        <Box shadow bg={surface.default} p="md" r="lg">
          <Text mb="xs" weight="medium">
            {label}
          </Text>
          <Stack gap="xs">
            {payload
              .filter(entry => entry.value > 0 && entry.dataKey !== 'total')
              .map((entry, index) => (
                <Flex key={index} align="center" gap="lg" justify="between">
                  <Flex align="center" gap="xs">
                    <Box
                      flexShrink="0"
                      style={{
                        backgroundColor: entry.stroke,
                        borderRadius: '2px',
                        height: '0.625rem',
                        width: '0.625rem'
                      }}
                    />
                    <Text color="muted">{entry.name}</Text>
                  </Flex>
                  <Text
                    size="sm"
                    style={{ color: entry.stroke }}
                    weight="semibold"
                  >
                    {dayjs.duration(entry.value, 'minutes').humanize()}
                  </Text>
                </Flex>
              ))}
          </Stack>
        </Box>
      )
    }

    return null
  }

  return (
    <Widget
      actionComponent={
        <IntervalSelector
          display={{ base: 'none', md: 'flex' }}
          lastFor={lastFor}
          options={['7 days', '30 days']}
          setLastFor={setLastFor}
        />
      }
      icon={
        {
          languages: 'tabler:code',
          projects: 'tabler:clipboard'
        }[type]
      }
      title={`${type}TimeGraph`}
    >
      <IntervalSelector
        display={{ base: 'flex', md: 'none' }}
        lastFor={lastFor}
        mb="md"
        options={['7 days', '30 days']}
        setLastFor={setLastFor}
      />
      <Box minHeight="24rem" width="100%">
        <WithQuery query={dataQuery}>
          {data =>
            data.length > 0 ? (
              <ResponsiveContainer height="100%" width="100%">
                <ComposedChart data={chartData}>
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
                    tick={{ fill: 'currentColor', fontSize: 12 }}
                    tickFormatter={(value: number) =>
                      `${Math.round(value / 60)}h`
                    }
                    tickLine={false}
                    width={50}
                  />

                  {allItems.map((item, index) => (
                    <Bar
                      key={item}
                      dataKey={item}
                      fill={tinycolor({
                        h: (index * 360) / allItems.length,
                        s: 100,
                        v: 100,
                        a: 0.4
                      }).toRgbString()}
                      name={item}
                      stackId="stack"
                      stroke={tinycolor({
                        h: (index * 360) / allItems.length,
                        s: 100,
                        v: 100,
                        a: 1
                      }).toRgbString()}
                      strokeWidth={1}
                    />
                  ))}
                  <Line
                    dataKey="total"
                    dot={false}
                    legendType="none"
                    name="Total minutes"
                    stroke={
                      derivedTheme === 'dark'
                        ? bgTempPalette[100]
                        : bgTempPalette[500]
                    }
                    strokeWidth={3}
                    type="monotone"
                  />
                  <Legend />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: 'rgba(156, 163, 175, 0.1)' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <EmptyStateScreen
                icon="tabler:calendar-off"
                message={{
                  id: 'activities'
                }}
              />
            )
          }
        </WithQuery>
      </Box>
    </Widget>
  )
}

export default CodeTimeTimeChart
