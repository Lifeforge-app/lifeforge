/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Icon } from '@iconify/react'
import React from 'react'
import { Doughnut } from 'react-chartjs-2'

const data = {
  labels: ['Images', 'Videos', 'Musics', 'Documents'],
  datasets: [
    {
      label: 'Storage occupation',
      data: [19, 12, 3, 5],
      backgroundColor: [
        'rgba(244, 63, 94, 0.2)',
        'rgba(245 ,158, 11, 0.2)',
        'rgba(59, 130, 246, 0.2)',
        'rgba(34, 197, 94, 0.2)'
      ],
      borderColor: [
        'rgba(244, 63, 94, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(34, 197, 94, 1)'
      ],
      borderWidth: 1
    }
  ]
}

const options = {
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context: any) {
          let label = context.dataset.label || ''

          if (label) {
            label += ': '
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('en-US', {
              style: 'percent',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }).format(context.parsed / 100)
          }
          return label
        }
      }
    },
    legend: {
      labels: {
        color: 'rgb(18, 18, 18)'
      },
      position: 'bottom' as const
    }
  }
}

export default function StorageStatus(): React.JSX.Element {
  return (
    <section className="col-span-1 flex w-full flex-col gap-4 rounded-lg bg-bg-50 p-6 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900">
      <h1 className="mb-2 flex items-center gap-2 text-xl font-semibold">
        <Icon icon="tabler:server" className="text-2xl" />
        <span className="ml-2">Storage Status</span>
      </h1>
      <div className="flex h-full w-full items-center justify-center">
        <Doughnut data={data} options={options} />
      </div>
      <p className="text-center text-lg font-medium">520 GB of 1 TB used</p>
    </section>
  )
}
