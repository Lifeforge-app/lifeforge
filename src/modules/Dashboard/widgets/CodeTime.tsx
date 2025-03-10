/* eslint-disable import/named */
import { Icon } from '@iconify/react'
import { ChartOptions, ScriptableContext } from 'chart.js'
import clsx from 'clsx'
import moment from 'moment'
import React, { useState, useMemo } from 'react'
import { Bar, Line } from 'react-chartjs-2'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import LoadingScreen from '@components/screens/LoadingScreen'
import DashboardItem from '@components/utilities/DashboardItem'
import useFetch from '@hooks/useFetch'
import useThemeColors from '@hooks/useThemeColor'
import { getDatesBetween } from '@utils/date'

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

const ViewSelector = ({
  view,
  setView
}: {
  view: 'bar' | 'line'
  setView: React.Dispatch<React.SetStateAction<'bar' | 'line'>>
}) => {
  const views = ['bar', 'line']

  return (
    <div className="bg-bg-50 shadow-custom dark:bg-bg-800/50 flex items-center gap-2 rounded-md p-2">
      {views.map(viewType => (
        <button
          key={viewType}
          className={clsx(
            'flex items-center gap-2 rounded-md p-2 px-4 transition-all',
            viewType === view
              ? 'bg-bg-200/50 dark:bg-bg-700/50'
              : 'text-bg-500 hover:text-bg-800 dark:hover:text-bg-50'
          )}
          onClick={() => setView(viewType as 'bar' | 'line')}
        >
          <Icon
            className="size-6"
            icon={viewType === 'bar' ? 'tabler:chart-bar' : 'tabler:chart-line'}
          />
          {viewType[0].toUpperCase() + viewType.slice(1)}
        </button>
      ))}
    </div>
  )
}

const CodeTime = (): React.ReactElement => {
  const [data] = useFetch<ICodeTimeEachDay[]>('code-time/each-day')
  const { theme } = useThemeColors()
  const [view, setView] = useState<'bar' | 'line'>('bar')

  const chartData = useMemo(() => {
    if (typeof data === 'string') return null
    if (!data || data.length === 0) return 'No data'

    const labels = getDatesBetween(
      moment(data[0].date),
      moment(data[data.length - 1].date)
    ).map(date => date.format('DD MMM'))

    const processedData = labels.map(date => {
      const day = data.find(
        d => d.date === moment(date, 'DD MMM').format('YYYY-MM-DD')
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
            let finalTheme = theme
            if (theme.startsWith('#')) {
              const hex = theme.replace('#', '')
              const r = parseInt(hex.substring(0, 2), 16)
              const g = parseInt(hex.substring(2, 4), 16)
              const b = parseInt(hex.substring(4, 6), 16)
              finalTheme = `rgba(${r}, ${g}, ${b})`
            }
            gradient.addColorStop(0, finalTheme.replace(')', ', 0.5)'))
            gradient.addColorStop(1, finalTheme.replace(')', ', 0)'))
            return gradient
          },
          fill: 'origin',
          lineTension: 0.3,
          borderColor: theme,
          borderWidth: 1,
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointBackgroundColor: 'rgba(0, 0, 0, 0)',
          pointHoverBackgroundColor: `${theme}80`,
          pointHoverBorderColor: theme,
          pointHoverBorderWidth: 2,
          pointHoverRadius: 6
        }
      ]
    }
  }, [data, theme])

  const renderContent = () => {
    if (!chartData) return <LoadingScreen />
    if (chartData === 'No data')
      return (
        <EmptyStateScreen
          smaller
          icon="tabler:database-off"
          name="data"
          namespace="modules.dashboard"
          tKey="widgets.codeTime"
        />
      )

    switch (view) {
      case 'bar':
        return <Bar data={chartData as any} options={chartOptions as any} />
      case 'line':
        return <Line data={chartData} options={chartOptions as any} />
      default:
        return null
    }
  }

  return (
    <DashboardItem
      componentBesideTitle={<ViewSelector setView={setView} view={view} />}
      icon="tabler:chart-line"
      title="Code Time"
    >
      <div className="flex-center size-full min-h-0 flex-1">
        {renderContent()}
      </div>
    </DashboardItem>
  )
}

export default CodeTime
