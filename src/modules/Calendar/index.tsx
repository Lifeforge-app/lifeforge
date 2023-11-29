/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/indent */
import React from 'react'
import ModuleHeader from '../../components/ModuleHeader'
import { Icon } from '@iconify/react'

function Calendar(): React.JSX.Element {
  return (
    <section className="flex w-full flex-col overflow-y-auto px-12">
      <ModuleHeader
        title="Calendar"
        desc="Make sure you don't miss important event."
      />
      <div className="mb-12 mt-8 flex min-h-0 w-full flex-1">
        <aside className="flex h-full flex-col gap-8">
          <section className="flex w-full flex-col gap-4 rounded-lg bg-neutral-800/50 p-8">
            <div className="h-full w-full">
              <div className="mb-6 flex items-center justify-between gap-2">
                <button className="rounded-lg p-4 text-neutral-500 transition-all hover:bg-neutral-700/50">
                  <Icon icon="tabler:chevron-left" className="text-2xl" />
                </button>
                <div className="text-lg font-semibold text-neutral-50">
                  November 2023
                </div>
                <button className="rounded-lg p-4 text-neutral-500 transition-all hover:bg-neutral-700/50">
                  <Icon icon="tabler:chevron-right" className="text-2xl" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div
                    key={day}
                    className="flex items-center justify-center text-sm text-neutral-500"
                  >
                    {day}
                  </div>
                ))}
                {Array(35)
                  .fill(0)
                  .map((_, index) =>
                    (() => {
                      const date = new Date()
                      const firstDay =
                        new Date(
                          date.getFullYear(),
                          date.getMonth(),
                          1
                        ).getDay() - 1
                      const lastDate = new Date(
                        date.getFullYear(),
                        date.getMonth() + 1,
                        0
                      ).getDate()
                      const lastDateOfPrevMonth =
                        new Date(
                          date.getFullYear(),
                          date.getMonth(),
                          0
                        ).getDate() - 1
                      const actualIndex =
                        firstDay > index
                          ? lastDateOfPrevMonth - firstDay + index + 2
                          : index - firstDay + 1 > lastDate
                          ? index - lastDate - firstDay + 1
                          : index - firstDay + 1
                      return (
                        <div
                          key={index}
                          className={`relative isolate flex flex-col items-center gap-1 text-sm ${
                            firstDay > index || index - firstDay + 1 > lastDate
                              ? 'text-neutral-600'
                              : 'text-neutral-100'
                          } ${
                            actualIndex === date.getDate()
                              ? "font-semibold after:absolute after:left-1/2 after:top-1/2 after:z-[-1] after:h-10 after:w-10 after:-translate-x-1/2 after:-translate-y-6 after:rounded-md after:border after:border-teal-500 after:bg-teal-500/10 after:content-['']"
                              : ''
                          }`}
                        >
                          <span>{actualIndex}</span>
                          {(() => {
                            const randomTrue = Math.random() > 0.7
                            return randomTrue &&
                              !(
                                firstDay > index ||
                                index - firstDay + 1 > lastDate
                              ) ? (
                              <div className="h-0.5 w-3 rounded-full bg-rose-500" />
                            ) : (
                              ''
                            )
                          })()}
                        </div>
                      )
                    })()
                  )}
              </div>
            </div>
          </section>
          <section className="flex w-full flex-col gap-4 overflow-y-auto rounded-lg bg-neutral-800/50">
            <h2 className="flex items-center gap-4 px-8 py-4 pt-8 text-sm font-semibold uppercase tracking-widest text-neutral-600 transition-all">
              Categories
            </h2>
            <ul className="flex flex-col overflow-y-hidden pb-8 hover:overflow-y-scroll">
              {[
                ['Design', 'bg-green-500'],
                ['Frontend', 'bg-blue-500'],
                ['Backend', 'bg-yellow-500'],
                ['Marketing', 'bg-red-500'],
                ['Sales', 'bg-purple-500'],
                ['Support', 'bg-pink-500']
              ].map(([name, color], index) => (
                <li
                  key={index}
                  className="relative flex items-center gap-6 px-4 font-medium text-neutral-400 transition-all"
                >
                  <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-neutral-800">
                    <span
                      className={`block h-1.5 w-1.5 shrink-0 rounded-full ${color}`}
                    />
                    <div className="flex w-full items-center justify-between">
                      {name}
                    </div>
                    <span className="text-sm">
                      {Math.floor(Math.random() * 10)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </aside>
        <div className="ml-12 flex h-full flex-1 flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button className="rounded-lg p-4 text-neutral-500 transition-all hover:bg-neutral-700/50">
                <Icon icon="tabler:chevron-left" className="text-2xl" />
              </button>
              <button className="rounded-lg p-4 text-neutral-500 transition-all hover:bg-neutral-700/50">
                <Icon icon="tabler:chevron-right" className="text-2xl" />
              </button>
              <div className="ml-4 text-3xl font-semibold text-neutral-50">
                Nov 20 - 26, 2023
              </div>
              <span className="ml-4 rounded-full bg-teal-500/20 px-4 py-1.5 text-sm font-semibold text-teal-500">
                Week{' '}
                {(() => {
                  const currentDate = new Date()
                  const startDate = new Date(currentDate.getFullYear(), 0, 1)
                  const days = Math.floor(
                    (currentDate - startDate) / (24 * 60 * 60 * 1000)
                  )

                  const weekNumber = Math.ceil(days / 7)

                  return weekNumber
                })()}
              </span>
            </div>
            <search className="flex items-center gap-4">
              <button className="rounded-lg p-4 text-neutral-500 transition-all hover:bg-neutral-700/50">
                <Icon icon="tabler:search" className="text-2xl" />
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-teal-500 p-4 pr-5 font-semibold uppercase tracking-wider text-neutral-800 transition-all hover:bg-teal-600">
                <Icon icon="tabler:plus" className="text-xl" />
                create
              </button>
            </search>
          </div>
          <div className="mt-4 flex flex-1 flex-col overflow-hidden">
            <div className="mb-1.5 flex w-full">
              <div className="flex w-20 shrink-0 flex-col items-center justify-center rounded-lg bg-neutral-800/50 py-4 text-neutral-500">
                GMT
                <span className="text-xl">+8</span>
              </div>
              {Array(7)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className={`ml-1.5 flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-800/50 py-4 text-neutral-500 ${
                      index === 3 && 'bg-teal-500/20 text-teal-500'
                    }`}
                  >
                    <span>
                      {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][index]}
                    </span>
                    <span className="text-4xl font-semibold">{20 + index}</span>
                  </div>
                ))}
            </div>
            <div className="w-full flex-1 overflow-y-auto rounded-lg">
              <div className="h-full w-full divide-y divide-neutral-700">
                {Array(25)
                  .fill(0)
                  .map((_, hour) => (
                    <div key={hour} className="flex h-24">
                      <div className="relative h-full w-20 shrink-0 bg-neutral-800/50 text-neutral-500">
                        {hour !== 24 && (
                          <span className="absolute bottom-0 z-[9999] w-[90%] translate-y-1/2 bg-[#1e1e1e] pr-4 text-right">
                            {hour + 1 > 12 ? hour + 1 - 12 : hour + 1}{' '}
                            {hour + 1 >= 12 ? 'PM' : 'AM'}
                          </span>
                        )}
                      </div>
                      {Array(7)
                        .fill(0)
                        .map((_, day) => (
                          <div
                            key={day}
                            className="relative w-full bg-neutral-800/50"
                          >
                            {day === 3 && hour === 1 && (
                              <div className="absolute left-0 top-0 z-[9999] ml-1.5 h-72 w-[90%] overflow-hidden rounded-r-md bg-neutral-900">
                                <div className="flex h-full w-full flex-col justify-between border-l-4 border-green-500 bg-green-500/20 px-3 py-4">
                                  <div className="flex flex-col">
                                    <Icon
                                      icon="tabler:plane-departure"
                                      className="mb-2 h-6 w-6 text-green-500"
                                    />
                                    <span className="text-lg font-semibold text-green-500">
                                      Flight to Taiwan
                                    </span>
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1 text-center text-lg font-medium">
                                      SIN
                                      <Icon
                                        icon="tabler:arrow-right"
                                        className="inline-block h-5 w-5 text-green-500"
                                      />
                                      TPE
                                    </div>
                                    <span className="text-sm">FN: TR 898</span>
                                  </div>
                                  <div>
                                    <span className="text-sm text-green-500">
                                      01.00 AM - 05.00 AM
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Calendar
