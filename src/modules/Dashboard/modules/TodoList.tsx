import React from 'react'
import { Icon } from '@iconify/react'

export default function TodoList(): React.JSX.Element {
  return (
    <section className="col-span-2 row-span-2 flex w-full flex-col gap-4 rounded-lg bg-bg-50 p-8 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-800/50">
      <h1 className="mb-2 flex items-center gap-2 text-xl font-semibold">
        <Icon icon="tabler:clipboard-list" className="text-2xl" />
        <span className="ml-2">Todo List</span>
      </h1>
      <ul className="flex flex-col gap-4">
        <li className="flex items-center justify-between gap-4 rounded-lg border-l-4 border-indigo-500 bg-bg-100 p-4 px-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1)] dark:bg-bg-800">
          <div className="flex flex-col gap-1">
            <div className="font-semibold text-bg-800 dark:text-bg-100">
              Buy groceries
            </div>
            <div className="text-sm text-rose-500">
              10:00 AM, 23 Nov 2023 (overdue 8 hours)
            </div>
          </div>
          <button className="h-6 w-6 rounded-full border-2 border-bg-400 transition-all hover:border-orange-500" />
        </li>
        <li className="flex items-center justify-between gap-4 rounded-lg border-l-4 border-orange-500 bg-bg-100 p-4 px-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1)] dark:bg-bg-800">
          <div className="flex flex-col gap-1">
            <div className="font-semibold text-bg-800 dark:text-bg-100">
              Do homework
            </div>
            <div className="text-sm text-bg-400">00:00 AM, 31 Jan 2024</div>
          </div>
          <button className="h-6 w-6 rounded-full border-2 border-bg-400 transition-all hover:border-orange-500" />
        </li>
        <li className="flex items-center justify-between gap-4 rounded-lg border-l-4 border-orange-500 bg-bg-100 p-4 px-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1)] dark:bg-bg-800">
          <div className="flex flex-col gap-1">
            <div className="font-semibold text-bg-800 dark:text-bg-100">
              Start doing revision for SPM Sejarah
            </div>
            <div className="text-sm text-bg-400">00:00 AM, 31 Jan 2024</div>
          </div>
          <button className="h-6 w-6 rounded-full border-2 border-bg-400 transition-all hover:border-orange-500" />
        </li>
      </ul>
    </section>
  )
}
