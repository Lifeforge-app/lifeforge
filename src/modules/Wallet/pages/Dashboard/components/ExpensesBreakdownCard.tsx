import { Icon } from '@iconify/react'
import React from 'react'
import { Doughnut } from 'react-chartjs-2'

const data2 = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }
  ]
}

const options2 = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  cutout: '80%'
}

function ExpensesBreakdownCard(): React.ReactElement {
  return (
    <div className="col-span-1 row-span-4 flex w-full min-w-0 flex-col rounded-lg bg-bg-50 p-6 shadow-custom dark:bg-bg-900">
      <div className="flex w-full min-w-0 items-center justify-between gap-4">
        <h1 className="flex w-full min-w-0 items-center gap-2 text-xl font-semibold">
          <Icon icon="tabler:chart-donut-3" className="shrink-0 text-2xl" />
          <span className="ml-2 w-full min-w-0 truncate">
            Expenses Breakdown
          </span>
        </h1>
        <button className="flex items-center gap-2 rounded-lg p-2 text-bg-500 transition-all">
          <span className="whitespace-nowrap">Show more</span>
          <Icon icon="tabler:chevron-right" className="text-xl" />
        </button>
      </div>
      <div className="relative mx-auto mt-6 flex aspect-square w-4/5 min-w-0 flex-col gap-4">
        <Doughnut
          data={data2}
          options={options2}
          className="aspect-square w-full min-w-0"
        />
        <div className="absolute left-1/2 top-1/2 mt-2 flex size-full -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center">
          <div className="text-4xl font-medium">
            <span className="mr-1 text-xl text-bg-500">RM</span>
            108.56
          </div>
          <div className="mt-2 w-1/2 text-center text-base text-bg-500">
            Total spending for this month
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <span className="-mb-0.5 size-3 rounded-full bg-red-500"></span>
          <span className="text-sm">Food & Drinks</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="-mb-0.5 size-3 rounded-full bg-blue-500"></span>
          <span className="text-sm">Transport</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="-mb-0.5 size-3 rounded-full bg-yellow-500"></span>
          <span className="text-sm">Shops</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="-mb-0.5 size-3 rounded-full bg-fuchsia-500"></span>
          <span className="text-sm">Transfer</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="-mb-0.5 size-3 rounded-full bg-green-500"></span>
          <span className="text-sm">Entertainment</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="-mb-0.5 size-3 rounded-full bg-purple-500"></span>
          <span className="text-sm">Others</span>
        </div>
      </div>
      <ul className="mt-6 flex flex-col divide-y divide-bg-200 overflow-y-auto dark:divide-bg-800">
        <li className="flex items-center justify-between gap-4  p-4">
          <div className="flex items-center gap-4">
            <div className="rounded-md bg-red-500/20 p-2">
              <Icon
                icon="material-symbols:fastfood-outline-rounded"
                className="size-6 text-red-500"
              />
            </div>
            <div className="flex flex-col">
              <div className="font-semibold ">Food & Drinks</div>
              <div className="text-sm text-bg-500">5 transactions</div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-right">- RM 250.00</div>
            <div className="text-right text-sm text-bg-500">23%</div>
          </div>
        </li>
        <li className="flex items-center justify-between gap-4  p-4">
          <div className="flex items-center gap-4">
            <div className="rounded-md bg-blue-500/20 p-2">
              <Icon icon="tabler:car" className="size-6 text-blue-500" />
            </div>
            <div className="flex flex-col">
              <div className="font-semibold ">Transport</div>
              <div className="text-sm text-bg-500">6 transactions</div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-right">- RM 101.38</div>
            <div className="text-right text-sm text-bg-500">18%</div>
          </div>
        </li>
        <li className="flex items-center justify-between gap-4  p-4">
          <div className="flex items-center gap-4">
            <div className="rounded-md bg-yellow-500/20 p-2">
              <Icon
                icon="tabler:building-store"
                className="size-6 text-yellow-500"
              />
            </div>
            <div className="flex flex-col">
              <div className="font-semibold">Shops</div>
              <div className="text-sm text-bg-500">4 transactions</div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-right">- RM 64.41</div>
            <div className="text-right text-sm text-bg-500">16%</div>
          </div>
        </li>
        <li className="flex items-center justify-between gap-4  p-4">
          <div className="flex items-center gap-4">
            <div className="rounded-md bg-fuchsia-500/20 p-2">
              <Icon
                icon="tabler:arrow-left-circle"
                className="size-6 text-fuchsia-500"
              />
            </div>
            <div className="flex flex-col">
              <div className="font-semibold ">Transfer</div>
              <div className="text-sm text-bg-500">3 transaction</div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-right">- RM 42.77</div>
            <div className="text-right text-sm text-bg-500">12%</div>
          </div>
        </li>
        <li className="flex items-center justify-between gap-4  p-4">
          <div className="flex items-center gap-4">
            <div className="rounded-md bg-green-500/20 p-2">
              <Icon icon="tabler:movie" className="size-6 text-green-500" />
            </div>
            <div className="flex flex-col">
              <div className="font-semibold ">Entertainment</div>
              <div className="text-sm text-bg-500">0 transaction</div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-right">- RM 0.00</div>
            <div className="text-right text-sm text-bg-500">0%</div>
          </div>
        </li>
        <li className="flex items-center justify-between gap-4  p-4">
          <div className="flex items-center gap-4">
            <div className="rounded-md bg-purple-500/20 p-2">
              <Icon
                icon="tabler:circle-plus"
                className="size-6 text-purple-500"
              />
            </div>
            <div className="flex flex-col">
              <div className="font-semibold ">Others</div>
              <div className="text-sm text-bg-500">5 transactions</div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-right">- RM 162.00</div>
            <div className="text-right text-sm text-bg-500">20%</div>
          </div>
        </li>
      </ul>
    </div>
  )
}

export default ExpensesBreakdownCard
