/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Icon } from '@iconify/react'
import { type ChartOptions, type ScriptableContext } from 'chart.js'
import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'
import LoadingScreen from '@components/Screens/LoadingScreen'
import useFetch from '@hooks/useFetch'
import useThemeColorHex from '@hooks/useThemeColorHex'

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
  const [data] = useFetch<ICodeTimeEachDay[]>('code-time/each-day')
  const [chartData, setChartData] = useState<any>(null)
  const { t } = useTranslation()
  const { theme } = useThemeColorHex()

  useEffect(() => {
    if (typeof data !== 'string') {
      console.log(theme)
      const data2 = {
        labels: data.map(({ date }) =>
          new Date(date).toDateString().split(' ').slice(1, 3).join(' ')
        ),
        datasets: [
          {
            label: 'Code time',
            data: data.map(({ duration }) => duration / 3600000),
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
            tension: 0.4,
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
    <div className="flex size-full flex-col gap-4 rounded-lg bg-bg-50 p-6 shadow-custom dark:bg-bg-900">
      <h1 className="mb-2 flex items-center gap-2 text-xl font-semibold">
        <Icon icon="tabler:chart-line" className="text-2xl" />
        <span className="ml-2">{t('dashboard.widgets.codeTime.title')}</span>
      </h1>
      <div className="flex-center flex size-full min-h-0 flex-1">
        {chartData ? (
          /* @ts-expect-error - lazy to fix =) */
          <Line data={chartData} options={options2} />
        ) : (
          <LoadingScreen />
        )}
      </div>
    </div>
  )
}
