/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/indent */
import React from 'react'
import { Icon } from '@iconify/react'

export default function Calendar(): React.ReactElement {
  return (
    <section className="col-span-2 row-span-1 flex w-full flex-col gap-4 rounded-lg bg-bg-50 p-8 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900">
      <h1 className="mb-2 flex items-center gap-2 text-xl font-semibold">
        <Icon icon="tabler:calendar" className="text-2xl" />
        <span className="ml-2">Calendar</span>
      </h1>
      <div className="h-full w-full">
        <div className="mb-6 flex items-center justify-between">
          <button className="text-bg-100 rounded-lg p-4 transition-all hover:bg-bg-200 dark:hover:bg-bg-700/50">
            <Icon icon="tabler:chevron-left" className="text-2xl" />
          </button>
          <div className="text-lg font-semibold text-bg-800 dark:text-bg-100">
            November 2023
          </div>
          <button className="text-bg-100 rounded-lg p-4 transition-all hover:bg-bg-200 dark:hover:bg-bg-700/50">
            <Icon icon="tabler:chevron-right" className="text-2xl" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div
              key={day}
              className="text-bg-100 flex items-center justify-center text-sm"
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
                  new Date(date.getFullYear(), date.getMonth(), 1).getDay() - 1
                const lastDate = new Date(
                  date.getFullYear(),
                  date.getMonth() + 1,
                  0
                ).getDate()
                const lastDateOfPrevMonth =
                  new Date(date.getFullYear(), date.getMonth(), 0).getDate() - 1
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
                        ? 'text-bg-300'
                        : 'text-bg-800 dark:text-bg-100'
                    } ${
                      actualIndex === date.getDate()
                        ? "after:absolute after:left-1/2 after:top-1/2 after:z-[-1] after:h-10 after:w-10 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-md after:border after:border-custom-500 after:bg-custom-500/10 after:content-['']"
                        : ''
                    }`}
                  >
                    <span>{actualIndex}</span>
                    {(() => {
                      const randomTrue = Math.random() > 0.7
                      return randomTrue &&
                        !(
                          firstDay > index || index - firstDay + 1 > lastDate
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
  )
}
