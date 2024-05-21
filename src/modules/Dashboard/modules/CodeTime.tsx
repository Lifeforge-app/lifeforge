/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Icon } from '@iconify/react'
import { type ScriptableContext } from 'chart.js'
import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'
import Loading from '@components/Screens/Loading'
import useFetch from '@hooks/useFetch'

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

const options2 = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
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
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        type: 'time',
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

  useEffect(() => {
    if (typeof data !== 'string') {
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
              gradient.addColorStop(0, 'rgba(20,184,166,0.2)')
              gradient.addColorStop(1, 'rgba(20,184,166,0)')
              return gradient
            },
            fill: 'origin',
            borderColor: 'rgba(20, 184, 166, 1)',
            borderWidth: 1,
            tension: 0.4
          }
        ]
      }

      setChartData(data2)
    }
  }, [data])

  return (
    <section className="col-span-2 flex h-full w-full flex-col gap-4 rounded-lg bg-bg-50 p-6 shadow-custom dark:bg-bg-900">
      <h1 className="mb-2 flex items-center gap-2 text-xl font-semibold">
        <Icon icon="tabler:chart-line" className="text-2xl" />
        <span className="ml-2">{t('dashboard.modules.codeTime.title')}</span>
      </h1>
      <div className="flex w-full flex-1 flex-center">
        {/* @ts-expect-error - lazy to fix =) */}
        {chartData ? <Line data={chartData} options={options2} /> : <Loading />}
      </div>
    </section>
  )
}
