import React from 'react'
import { Icon } from '@iconify/react'

export default function TodaysEvent(): React.JSX.Element {
  return (
    <section className="col-span-1 flex w-full flex-col gap-4 rounded-lg bg-neutral-50 p-6 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-neutral-800/50">
      <h1 className="mb-2 flex items-center gap-2 text-xl font-semibold">
        <Icon icon="tabler:calendar" className="text-2xl" />
        <span className="ml-2">Today&apos;s Event</span>
      </h1>
      <ul className="flex h-full flex-col gap-4">
        <li className="flex flex-1 items-center justify-between gap-4 rounded-lg bg-neutral-100 p-4 shadow-[4px_4px_10px_rgba(0,0,0,0.1)] dark:bg-neutral-800">
          <div className="h-full w-1.5 rounded-full bg-rose-500" />
          <div className="flex w-full flex-col gap-1">
            <div className="font-semibold text-neutral-800 dark:text-neutral-100">
              Coldplay&apos;s concert
            </div>
            <div className="text-sm text-neutral-400">8:00 PM</div>
          </div>
        </li>
        <li className="flex flex-1 items-center justify-between gap-4 rounded-lg bg-neutral-100 p-4 shadow-[4px_4px_10px_rgba(0,0,0,0.1)] dark:bg-neutral-800">
          <div className="h-full w-1.5 rounded-full bg-purple-500" />
          <div className="flex w-full flex-col gap-1">
            <div className="font-semibold text-neutral-800 dark:text-neutral-100">
              Meeting with client
            </div>
            <div className="text-sm text-neutral-400">10:00 PM</div>
          </div>
        </li>
        <li className="flex flex-1 items-center justify-between gap-4 rounded-lg bg-neutral-100 p-4 shadow-[4px_4px_10px_rgba(0,0,0,0.1)] dark:bg-neutral-800">
          <div className="h-full w-1.5 rounded-full bg-purple-500" />
          <div className="flex w-full flex-col gap-1">
            <div className="font-semibold text-neutral-800 dark:text-neutral-100">
              Deadline for project
            </div>
            <div className="text-sm text-neutral-400">11:59 PM</div>
          </div>
        </li>
      </ul>
    </section>
  )
}
