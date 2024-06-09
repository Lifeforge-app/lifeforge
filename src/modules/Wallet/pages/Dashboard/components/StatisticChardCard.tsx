import { faker } from '@faker-js/faker'
import { Icon } from '@iconify/react'
import React from 'react'
import { Line } from 'react-chartjs-2'

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July']

const options = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      display: false
    }
  },
  hover: {
    intersect: false
  }
}

const data = {
  labels,
  datasets: [
    {
      label: 'Income',
      data: labels.map(_ => faker.number.int({ min: 100, max: 700 })),
      borderColor: 'rgb(34 197 94)',
      backgroundColor: 'rgb(34 197 94)',
      tension: 0.6,
      pointBorderColor: 'rgba(0, 0, 0, 0)',
      pointBackgroundColor: 'rgba(0, 0, 0, 0)'
    },
    {
      label: 'Expenses',
      data: labels.map(_ => faker.number.int({ min: 100, max: 700 })),
      borderColor: 'rgb(239 68 68)',
      backgroundColor: 'rgb(239 68 68)',
      tension: 0.6,
      pointBorderColor: 'rgba(0, 0, 0, 0)',
      pointBackgroundColor: 'rgba(0, 0, 0, 0)'
    }
  ]
}

function StatisticChardCard(): React.ReactElement {
  return (
    <div className="col-span-2 row-span-2 flex size-full flex-col rounded-lg bg-bg-50 p-6 shadow-custom dark:bg-bg-900">
      <div className="flex w-full items-center justify-between">
        <h1 className="flex items-center gap-2 text-xl font-semibold">
          <Icon icon="tabler:chart-dots" className="text-2xl" />
          <span className="ml-2">Statistics</span>
        </h1>
        <div className="hidden items-center gap-8 sm:flex">
          <div className="flex items-center gap-2">
            <span className="-mb-0.5 size-3 rounded-full bg-green-500"></span>
            <span className="text-sm">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="-mb-0.5 size-3 rounded-full bg-red-500"></span>
            <span className="text-sm">Expenses</span>
          </div>
        </div>
      </div>
      <div className="flex-center mt-6 flex size-full min-h-0 flex-1">
        <Line data={data} options={options} className="w-full" />
      </div>
      <div className="mt-4 flex items-center justify-center gap-8 sm:hidden">
        <div className="flex items-center gap-2">
          <span className="-mb-0.5 size-3 rounded-full bg-green-500"></span>
          <span className="text-sm">Income</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="-mb-0.5 size-3 rounded-full bg-red-500"></span>
          <span className="text-sm">Expenses</span>
        </div>
      </div>
    </div>
  )
}

export default StatisticChardCard
