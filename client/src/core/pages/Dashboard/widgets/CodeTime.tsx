import { ChartOptions, ScriptableContext } from 'chart.js'
import dayjs, { Dayjs } from 'dayjs'
import {
  Button,
  DashboardItem,
  EmptyStateScreen,
  LoadingScreen,
  QueryWrapper
} from 'lifeforge-ui'
import { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import { Link } from 'react-router'
import tinycolor from 'tinycolor2'

import { usePersonalization } from 'shared/lib'
import { useAPIQuery } from 'shared/lib'

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

const chartOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        labelColor: () => ({
          borderColor: 'transparent',
          backgroundColor: 'black'
        }),
        label: context => {
          let label = context.dataset.label || ''
          if (label) label += ': '

          if (context.parsed.y !== null) {
            label += msToTime(context.parsed.y * 3600000)
          }

          return label
        }
      },
      intersect: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (label: number | string) =>
          `${Math.round(parseInt(label.toString()))}h`
      },
      grid: { drawOnChartArea: false },
      border: { color: 'rgba(163, 163, 163, 0.5)' }
    },
    x: {
      grid: { drawOnChartArea: false },
      border: { color: 'rgba(163, 163, 163, 0.5)' }
    }
  },
  hover: { intersect: false }
}

interface ICodeTimeEachDay {
  date: string
  duration: number
}

const CodeTime = () => {
  const dataQuery = useAPIQuery<ICodeTimeEachDay[]>('code-time/each-day', [
    'code-time',
    'each-day'
  ])

  const { derivedThemeColor: themeColor } = usePersonalization()

  const chartData = useMemo(() => {
    const data = dataQuery.data

    if (dataQuery.isLoading) return 'Loading'
    if (!data || data.length === 0) return 'No data'

    const labels = getDatesBetween(
      dayjs(data[0].date),
      dayjs(data[data.length - 1].date)
    ).map(date => date.format('DD MMM'))

    const processedData = labels.map(date => {
      const day = data.find(
        d => d.date === dayjs(date, 'DD MMM').format('YYYY-MM-DD')
      )

      return day ? day.duration / 3600000 : 0
    })

    return {
      labels,
      datasets: [
        {
          label: 'Code time',
          data: processedData,
          backgroundColor: (context: ScriptableContext<'line'>) => {
            const ctx = context.chart.ctx

            const gradient = ctx.createLinearGradient(0, 0, 0, 250)

            gradient.addColorStop(
              0,
              tinycolor(themeColor).setAlpha(0.5).toRgbString()
            )
            gradient.addColorStop(
              1,
              tinycolor(themeColor).setAlpha(0).toRgbString()
            )

            return gradient
          },
          fill: 'origin',
          lineTension: 0.3,
          borderColor: themeColor,
          borderWidth: 1,
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointHoverBackgroundColor: `${themeColor}80`,
          pointHoverBorderColor: themeColor,
          pointHoverBorderWidth: 2,
          pointHoverRadius: 6
        }
      ]
    }
  }, [dataQuery.data, dataQuery.isLoading, themeColor])

  const renderContent = () => {
    if (!chartData) return <LoadingScreen />
    if (chartData === 'No data')
      return (
        <EmptyStateScreen
          smaller
          icon="tabler:database-off"
          name="data"
          namespace="core.dashboard"
          tKey="widgets.codeTime"
        />
      )

    return <Bar data={chartData as any} options={chartOptions as any} />
  }

  return (
    <DashboardItem
      componentBesideTitle={
        <Button
          as={Link}
          className="p-2!"
          icon="tabler:chevron-right"
          to="/code-time"
          variant="plain"
        />
      }
      icon="tabler:chart-line"
      title="Code Time"
    >
      <div className="flex-1">
        <QueryWrapper query={dataQuery}>
          {() => <>{renderContent()}</>}
        </QueryWrapper>
      </div>
    </DashboardItem>
  )
}

export default CodeTime
