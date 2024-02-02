/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Icon } from '@iconify/react'
import { type ScriptableContext } from 'chart.js'
import { Line } from 'react-chartjs-2'

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

const raw = [
  ['2023-11-23T00:00:00Z', 12180000],
  ['2023-11-22T00:00:00Z', 7620000],
  ['2023-11-21T00:00:00Z', 16200000],
  ['2023-11-20T00:00:00Z', 18360000],
  ['2023-11-18T00:00:00Z', 2940000],
  ['2023-11-17T00:00:00Z', 16020000],
  ['2023-11-16T00:00:00Z', 2040000],
  ['2023-11-15T00:00:00Z', 3480000],
  ['2023-11-14T00:00:00Z', 7200000],
  ['2023-11-11T00:00:00Z', 5580000],
  ['2023-11-10T00:00:00Z', 8640000],
  ['2023-11-08T00:00:00Z', 480000],
  ['2023-11-06T00:00:00Z', 420000],
  ['2023-11-05T00:00:00Z', 9960000],
  ['2023-11-04T00:00:00Z', 13620000],
  ['2023-11-03T00:00:00Z', 5940000],
  ['2023-11-02T00:00:00Z', 13500000],
  ['2023-11-01T00:00:00Z', 11640000],
  ['2023-10-31T00:00:00Z', 16500000],
  ['2023-10-29T00:00:00Z', 13800000],
  ['2023-10-28T00:00:00Z', 22800000],
  ['2023-10-27T00:00:00Z', 7380000],
  ['2023-10-26T00:00:00Z', 8820000],
  ['2023-10-25T00:00:00Z', 960000],
  ['2023-10-24T00:00:00Z', 10440000]
].reverse()

const data2 = {
  labels: raw.map(([date]) =>
    new Date(date).toDateString().split(' ').slice(1, 3).join(' ')
  ),
  datasets: [
    {
      label: 'Code time',
      data: raw.map(([, value]) => (value as number) / 3600000),
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

export default function CodeTime(): React.JSX.Element {
  return (
    <section className="col-span-2 flex h-full w-full flex-col gap-4 rounded-lg bg-bg-50 p-6 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-800/50">
      <h1 className="mb-2 flex items-center gap-2 text-xl font-semibold">
        <Icon icon="tabler:chart-line" className="text-2xl" />
        <span className="ml-2">Code Time</span>
      </h1>
      <div className="flex h-72 w-full items-center justify-center">
        <Line data={data2} options={options2} />
      </div>
    </section>
  )
}
