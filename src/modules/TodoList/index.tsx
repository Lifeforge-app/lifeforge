import { Icon } from '@iconify/react'
import React from 'react'
import Sidebar from './components/Sidebar'
import ModuleHeader from '../../components/ModuleHeader'

function TodoList(): React.JSX.Element {
  return (
    <section className="flex h-full min-h-0 w-full flex-1 flex-col px-12">
      <ModuleHeader
        title="Todo List"
        desc="Human brain is not designed to remember everything."
      />
      <div className="mb-12 mt-8 flex min-h-0 w-full flex-1">
        <Sidebar />
        <div className="ml-12 h-full flex-1">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-semibold text-neutral-50">
              All Tasks <span className="text-base text-neutral-400">(10)</span>
            </h1>
          </div>
          <search className="my-8 flex w-full items-center gap-4 rounded-lg bg-neutral-800/50 p-4">
            <Icon icon="tabler:search" className="h-5 w-5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search projects ..."
              className="w-full bg-transparent text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
            />
          </search>
          <ul className="mt-6 flex flex-col gap-4">
            <li className="flex items-center justify-center">
              <button className="flex w-full items-center gap-2 rounded-lg border-2 border-dashed border-neutral-700 p-6 font-semibold uppercase tracking-widest text-neutral-700 hover:bg-neutral-800/30">
                <Icon icon="tabler:plus" className="text-2xl" />
                <span className="ml-1">Add New Task</span>
              </button>
            </li>
            <li className="flex items-center justify-between gap-4 rounded-lg border-l-4 border-indigo-500 bg-neutral-800/50 p-4 px-6">
              <div className="flex flex-col gap-1">
                <div className="font-semibold text-neutral-50">
                  Buy groceries
                </div>
                <div className="text-sm text-rose-500">
                  10:00 AM, 23 Nov 2023 (overdue 8 hours)
                </div>
              </div>
              <button className="h-6 w-6 rounded-full border-2 border-neutral-500 transition-all hover:border-orange-500" />
            </li>
            <li className="flex items-center justify-between gap-4 rounded-lg border-l-4 border-orange-500 bg-neutral-800/50 p-4 px-6">
              <div className="flex flex-col gap-1">
                <div className="font-semibold text-neutral-50">Do homework</div>
                <div className="text-sm text-neutral-500">
                  00:00 AM, 31 Jan 2024
                </div>
              </div>
              <button className="h-6 w-6 rounded-full border-2 border-neutral-500 transition-all hover:border-orange-500" />
            </li>
            <li className="flex items-center justify-between gap-4 rounded-lg border-l-4 border-orange-500 bg-neutral-800/50 p-4 px-6">
              <div className="flex flex-col gap-1">
                <div className="font-semibold text-neutral-50">
                  Start doing revision for SPM Sejarah
                </div>
                <div className="text-sm text-neutral-500">
                  00:00 AM, 31 Jan 2024
                </div>
              </div>
              <button className="h-6 w-6 rounded-full border-2 border-neutral-500 transition-all hover:border-orange-500" />
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export default TodoList
