/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Icon } from '@iconify/react'
import { type ChartOptions, type ScriptableContext } from 'chart.js'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Bar, Line } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import LoadingScreen from '@components/Screens/LoadingScreen'
import useFetch from '@hooks/useFetch'
import useThemeColors from '@hooks/useThemeColor'
import { getDatesBetween } from '@utils/date'

function msToTime(ms: number): string {
  const seconds = (ms / 1000).toFixed(1)
  const minutes = (ms / (1000 * 60)).toFixed(1)
  const hours = (ms / (1000 * 60 * 60)).toFixed(1)
  const days = (ms / (1000 * 60 * 60 * 24)).toFixed(1)
  if (parseFloat(seconds) < 60) return seconds + ' Sec'
  else if (parseFloat(minutes) < 60) return minutes + ' Min'
  else if (parseFloat(hours) < 24) return hours + ' Hrs'
  else return days + ' Days'
}

const options2: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        labelColor: function () {
          return {
            borderColor: 'transparent',
            backgroundColor: 'black'
          }
        },
        label: function (context: any) {
          let label = context.dataset.label || ''

          if (label) {
            label += ': '
          }
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
        type: 'time',
        // @ts-expect-error - Cannot fix lah this one ;-;
        callback: function (label: number) {
          return Math.round(label) + 'h'
        }
      },
      grid: {
        drawOnChartArea: false
      },
      border: {
        color: 'rgba(163, 163, 163, 0.5)'
      }
    },
    x: {
      grid: {
        drawOnChartArea: false
      },
      border: {
        color: 'rgba(163, 163, 163, 0.5)'
      }
    }
  },
  hover: {
    intersect: false
  }
}

interface ICodeTimeEachDay {
  date: string
  duration: number
}

export default function CodeTime(): React.ReactElement {
  const { componentBg } = useThemeColors()
  const [data] = useFetch<ICodeTimeEachDay[]>('code-time/each-day')
  const [chartData, setChartData] = useState<any>(null)
  const { t } = useTranslation()
  const { theme } = useThemeColors()
  const [view, setView] = useState<'bar' | 'line'>('bar')

  useEffect(() => {
    if (typeof data !== 'string') {
      if (data.length === 0) {
        setChartData('No data')
        return
      }

      const data2 = {
        labels: getDatesBetween(
          moment(data[0].date),
          moment(data[data.length - 1].date)
        ).map(date => date.format('DD MMM')),
        datasets: [
          {
            label: 'Code time',
            data: getDatesBetween(
              moment(data[0].date),
              moment(data[data.length - 1].date)
            ).map(date => {
              const day = data.find(d => d.date === date.format('YYYY-MM-DD'))
              return day ? day.duration / 3600000 : 0
            }),
            backgroundColor: (context: ScriptableContext<'line'>) => {
              const ctx = context.chart.ctx
              const gradient = ctx.createLinearGradient(0, 0, 0, 250)
              gradient.addColorStop(0, theme.replace(')', ', 0.5)'))
              gradient.addColorStop(1, theme.replace(')', ', 0)'))
              return gradient
            },
            fill: 'origin',
            borderColor: theme,
            borderWidth: 1,
            pointBorderColor: 'rgba(0, 0, 0, 0)',
            pointBackgroundColor: 'rgba(0, 0, 0, 0)',
            pointHoverBackgroundColor: theme + '80',
            pointHoverBorderColor: theme,
            pointHoverBorderWidth: 2,
            pointHoverRadius: 6
          }
        ]
      }

      setChartData(data2)
    }
  }, [data])

  return (
    <div
      className={`flex size-full flex-col gap-4 rounded-lg p-4 shadow-custom ${componentBg}`}
    >
      <div className="flex-between flex">
        <h1 className="mb-2 flex items-center gap-2 text-xl font-semibold">
          <Icon icon="tabler:chart-line" className="text-2xl" />
          <span className="ml-2">{t('dashboard.widgets.codeTime.title')}</span>
        </h1>
        <div className="flex items-center gap-2 rounded-md bg-bg-50 p-2 shadow-custom dark:bg-bg-800/50">
          {['bar', 'line'].map(viewType => (
            <button
              key={viewType}
              onClick={() => {
                setView(viewType as 'bar' | 'line')
              }}
              className={`flex items-center gap-2 rounded-md p-2 px-4 transition-all ${
                viewType === view
                  ? 'bg-bg-200/50 dark:bg-bg-700/50'
                  : 'text-bg-500 hover:text-bg-800 dark:hover:text-bg-50'
              }`}
            >
              <Icon
                icon={
                  viewType === 'bar'
                    ? 'tabler:chart-bar'
                    : viewType === 'line'
                    ? 'tabler:chart-line'
                    : ''
                }
                className="size-6"
              />
              {viewType[0].toUpperCase() + viewType.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-center flex size-full min-h-0 flex-1">
        {chartData ? (
          chartData === 'No data' ? (
            <EmptyStateScreen
              icon="tabler:database-off"
              title="No Data"
              description="No data available for this chart"
            />
          ) : view === 'bar' ? (
            /* @ts-expect-error - lazy to fix =) */
            <Bar data={chartData} options={options2} />
          ) : (
            /* @ts-expect-error - lazy to fix =) */
            <Line data={chartData} options={options2} />
          )
        ) : (
          <LoadingScreen />
        )}
      </div>
    </div>
  )
}
