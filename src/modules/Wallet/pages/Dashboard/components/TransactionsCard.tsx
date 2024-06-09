import { faker } from '@faker-js/faker'
import { Icon } from '@iconify/react'
import moment from 'moment'
import React from 'react'

function TransactionsCard(): React.ReactElement {
  return (
    <div className="col-span-2 row-span-3 flex h-full flex-col rounded-lg bg-bg-50 p-6 shadow-custom dark:bg-bg-900">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <h1 className="flex w-full items-center gap-2 text-xl font-semibold sm:w-auto">
          <Icon icon="tabler:list" className="text-2xl" />
          <span className="ml-2">Recent Transactions</span>
        </h1>
        <div className="flex w-full items-center justify-between gap-2 rounded-md border-2 border-bg-200 p-4 dark:border-bg-800 sm:w-auto">
          <div className="flex items-center gap-2">
            <Icon icon="tabler:books" className="size-5" />
            <span>All ledgers</span>
          </div>
          <Icon
            icon="tabler:chevron-down"
            className="ml-4 size-4 text-bg-500"
          />
        </div>
      </div>
      <div className="mt-6 size-full overflow-y-auto">
        <table className="hidden w-full lg:table">
          <thead>
            <tr className="border-b-2 border-bg-200 text-bg-500 dark:border-bg-800">
              <th className="py-2">Date</th>
              <th className="py-2">Type</th>
              <th className="py-2 text-left">Particular</th>
              <th className="py-2">Category</th>
              <th className="py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 30 }).map((_, i) => {
              const randomType = faker.helpers.arrayElement([
                'income',
                'expenses',
                'expenses'
              ])
              const randomName = faker.company.name()
              const randomCategory = faker.helpers.arrayElement([
                [
                  'Food & Drinks',
                  'bg-red-500/20 text-red-500',
                  'material-symbols:fastfood-outline-rounded'
                ],
                ['Transport', 'bg-blue-500/20 text-blue-500', 'tabler:car'],
                [
                  'Shops',
                  'bg-yellow-500/20 text-yellow-500',
                  'tabler:building-store'
                ],
                [
                  'Transfer',
                  'bg-fuchsia-500/20 text-fuchsia-500',
                  'tabler:arrow-left-circle'
                ],
                [
                  'Entertainment',
                  'bg-green-500/20 text-green-500',
                  'tabler:movie'
                ],
                [
                  'Others',
                  'bg-purple-500/20 text-purple-500',
                  'tabler:circle-plus'
                ]
              ])
              const randomAmount = faker.finance.amount()
              const randomDate = moment(faker.date.anytime()).format(
                'MMM DD, YYYY'
              )

              return (
                <tr
                  key={i}
                  className="border-b border-bg-200 dark:border-bg-800"
                >
                  <td className="py-2 text-center">{randomDate}</td>
                  <td className="py-4 text-center">
                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        randomType === 'income'
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}
                    >
                      {randomType === 'income' ? 'Income' : 'Expenses'}
                    </span>
                  </td>
                  <td className="py-2">{randomName}</td>
                  <td className="py-2 text-center">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm ${randomCategory[1]}`}
                    >
                      <Icon icon={randomCategory[2]} className="size-4" />
                      {randomCategory[0]}
                    </span>
                  </td>
                  <td className="py-2 text-center">
                    <span
                      className={`${
                        randomType === 'income'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {randomType === 'income' ? '+' : '-'}
                      {randomAmount}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <ul className="flex flex-col gap-4 lg:hidden">
          {Array.from({ length: 30 }).map((_, i) => {
            const randomType = faker.helpers.arrayElement([
              'income',
              'expenses',
              'expenses'
            ])
            const randomName = faker.company.name()
            const randomCategory = faker.helpers.arrayElement([
              [
                'Food & Drinks',
                'bg-red-500/20 text-red-500',
                'material-symbols:fastfood-outline-rounded'
              ],
              ['Transport', 'bg-blue-500/20 text-blue-500', 'tabler:car'],
              [
                'Shops',
                'bg-yellow-500/20 text-yellow-500',
                'tabler:building-store'
              ],
              [
                'Transfer',
                'bg-fuchsia-500/20 text-fuchsia-500',
                'tabler:arrow-left-circle'
              ],
              [
                'Entertainment',
                'bg-green-500/20 text-green-500',
                'tabler:movie'
              ],
              [
                'Others',
                'bg-purple-500/20 text-purple-500',
                'tabler:circle-plus'
              ]
            ])
            const randomAmount = faker.finance.amount()
            const randomDate = moment(faker.date.anytime()).format(
              'MMM DD, YYYY'
            )

            return (
              <li
                key={i}
                className="flex items-center justify-between gap-4  p-4"
              >
                <div className="flex items-center gap-4">
                  <div className={`rounded-md ${randomCategory[1]} p-2`}>
                    <Icon icon={randomCategory[2]} className={'size-6'} />
                  </div>
                  <div className="flex flex-col">
                    <div className="font-semibold ">{randomName}</div>
                    <div className="text-sm text-bg-500">
                      {randomType === 'income' ? 'Income' : 'Expenses'}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="text-right">
                    <span
                      className={`${
                        randomType === 'income'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {randomType === 'income' ? '+' : '-'}
                      {randomAmount}
                    </span>
                  </div>
                  <div className="text-right text-sm text-bg-500">
                    {randomDate}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default TransactionsCard
