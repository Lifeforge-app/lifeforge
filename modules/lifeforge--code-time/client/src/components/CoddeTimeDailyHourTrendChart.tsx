import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

import {
  Box,
  Card,
  Flex,
  Text,
  Widget,
  usePersonalization
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

function CoddeTimeDailyHourTrendChart() {
  const { derivedThemeColor, bgTempPalette, derivedTheme } =
    usePersonalization()

  const hourlyTrendDataQuery = useQuery(
    forgeAPI.getTimeDistribution.queryOptions()
  )

  const currentHour = dayjs().hour()

  const chartData = useMemo(() => {
    if (!hourlyTrendDataQuery.data) return []

    return Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      timeSpent: hourlyTrendDataQuery.data[i] || 0
    }))
  }, [hourlyTrendDataQuery.data])

  const CustomTooltip = ({
    active,
    payload
  }: {
    active?: boolean
    payload?: Array<{ value: number; payload: { hour: number } }>
  }) => {
    if (active && payload && payload.length) {
      const hour = payload[0].payload.hour

      const minutes = payload[0].value

      return (
        <Card
          bg={{
            base: 'bg-100',
            dark: 'bg-800'
          }}
        >
          <Text mb="xs" weight="medium">
            {dayjs().startOf('day').add(hour, 'hours').format('hh:mm A')}
          </Text>
          <Flex align="center" gap="xs">
            <Text color="muted">Time Spent:</Text>
            <Text style={{ color: derivedThemeColor }} weight="semibold">
              {minutes} minutes
            </Text>
          </Flex>
        </Card>
      )
    }

    return null
  }

  return (
    <Widget
      gridColumnSpan={{ base: 1, lg: 2 }}
      icon="tabler:hourglass"
      title="Daily Hour Trend"
    >
      {hourlyTrendDataQuery.data && (
        <Box minHeight="24rem">
          <ResponsiveContainer height="100%" width="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorTimeSpent" x1="0" x2="0" y1="0" y2="1">
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
                stroke={bgTempPalette[derivedTheme === 'dark' ? '700' : '300']}
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                axisLine={false}
                dataKey="hour"
                label={{
                  value: 'Hour of the Day',
                  position: 'insideBottom',
                  offset: -5
                }}
                tick={{ fill: 'currentColor', fontSize: 12 }}
                tickFormatter={value => `${value}:00`}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                label={{
                  value: 'Time Spent (seconds)',
                  angle: -90,
                  position: 'insideLeft'
                }}
                tick={{ fill: 'currentColor', fontSize: 12 }}
                tickLine={false}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                label={{
                  value: 'Current Time',
                  position: 'top',
                  fill:
                    derivedTheme === 'dark'
                      ? bgTempPalette[400]
                      : bgTempPalette[600],
                  fontSize: 14,
                  fontWeight: 'medium'
                }}
                stroke={
                  derivedTheme === 'dark'
                    ? bgTempPalette[400]
                    : bgTempPalette[600]
                }
                strokeDasharray="5 5"
                strokeWidth={2}
                x={currentHour}
              />
              <Area
                dataKey="timeSpent"
                fill="url(#colorTimeSpent)"
                stroke="none"
                type="monotone"
              />
              <Line
                dataKey="timeSpent"
                dot={{ fill: derivedThemeColor, r: 3 }}
                name="Time Spent"
                stroke={derivedThemeColor}
                strokeWidth={2}
                type="monotone"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Widget>
  )
}

export default CoddeTimeDailyHourTrendChart
