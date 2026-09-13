import { useQuery } from '@tanstack/react-query'
import dayjs, { Dayjs } from 'dayjs'
import { useMemo } from 'react'
import { Link } from 'react-router'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

import type { WidgetConfig } from '@lifeforge/configs'
import {
  Box,
  Button,
  Card,
  EmptyStateScreen,
  Flex,
  LoadingScreen,
  Text,
  Widget,
  WithQuery,
  usePersonalization
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

const getDatesBetween = (start: Dayjs, end: Dayjs): Dayjs[] => {
  if (!start.isValid() || !end.isValid() || start.isAfter(end, 'day')) {
    return []
  }

  if (start.isSame(end, 'day')) return [start]

  return [start].concat(getDatesBetween(start.clone().add(1, 'day'), end))
}

const msToTime = (ms: number): string => {
  const timeUnits = [
    { unit: 'Sec', value: 1000 },
    { unit: 'Min', value: 1000 * 60 },
    { unit: 'Hrs', value: 1000 * 60 * 60 },
    { unit: 'Days', value: 1000 * 60 * 60 * 24 }
  ]

  for (let i = 0; i < timeUnits.length; i++) {
    if (ms < timeUnits[i].value * 60 || i === timeUnits.length - 1) {
      return (ms / timeUnits[i].value).toFixed(1) + ` ${timeUnits[i].unit}`
    }
  }

  return '0 Sec'
}

const CodeTime = () => {
  const dataQuery = useQuery(
    forgeAPI.getEachDay.queryOptions({
      refetchInterval: 1000 * 60
    })
  )

  const {
    derivedThemeColor: themeColor,
    bgTempPalette,
    derivedTheme
  } = usePersonalization()

  const chartData = useMemo(() => {
    const data = dataQuery.data

    if (dataQuery.isLoading) return 'Loading'
    if (!data || data.length === 0) return 'No data'

    const dates = getDatesBetween(
      dayjs(data[0].date),
      dayjs(data[data.length - 1].date)
    )

    return dates.map(date => {
      const dateStr = date.format('YYYY-MM-DD')

      const day = data.find(d => d.date === dateStr)

      return {
        date: date.format('DD MMM'),
        hours: day ? day.duration / 3600000 : 0
      }
    })
  }, [dataQuery.data, dataQuery.isLoading])

  const CustomTooltip = ({
    active,
    payload
  }: {
    active?: boolean
    payload?: Array<{ value: number; payload: { date: string } }>
  }) => {
    if (active && payload && payload.length) {
      const hours = payload[0].value

      return (
        <Card>
          <Box p="md">
            <Text mb="xs" weight="medium">
              {payload[0].payload.date}
            </Text>
            <Flex align="center" gap="xs">
              <Text color="muted">Code time:</Text>
              <Text style={{ color: themeColor }} weight="semibold">
                {msToTime(hours * 3600000)}
              </Text>
            </Flex>
          </Box>
        </Card>
      )
    }

    return null
  }

  const renderContent = () => {
    if (!chartData) return <LoadingScreen />
    if (chartData === 'No data' || chartData === 'Loading')
      return (
        <EmptyStateScreen
          smaller
          icon="tabler:code-off"
          message={{
            id: 'data',
            tKey: 'widgets.codeTime'
          }}
        />
      )

    return (
      <ResponsiveContainer height="100%" width="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorCodeTime" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor={themeColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={themeColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            axisLine={false}
            dataKey="date"
            tick={{ fill: 'currentColor', fontSize: 11 }}
            tickLine={false}
          />
          <CartesianGrid
            stroke={bgTempPalette[derivedTheme === 'dark' ? '700' : '300']}
            strokeDasharray="3 3"
            vertical={false}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: 'currentColor', fontSize: 11 }}
            tickFormatter={value => `${Math.round(value)}h`}
            tickLine={false}
            width={35}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            dataKey="hours"
            fill="url(#colorCodeTime)"
            stroke={themeColor}
            strokeWidth={2}
            type="monotone"
          />
        </AreaChart>
      </ResponsiveContainer>
    )
  }

  return (
    <Widget
      actionComponent={
        <Button
          as={Link}
          icon="tabler:chevron-right"
          to="/code-time"
          variant="plain"
        />
      }
      icon="tabler:chart-line"
      title="Code Time"
    >
      <Box flex="1">
        <WithQuery query={dataQuery}>{() => <>{renderContent()}</>}</WithQuery>
      </Box>
    </Widget>
  )
}

export default CodeTime

export const config: WidgetConfig = {
  id: 'codeTime',
  icon: 'tabler:code',
  minH: 3
}
