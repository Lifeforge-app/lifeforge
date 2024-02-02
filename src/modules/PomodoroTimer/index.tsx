/* eslint-disable multiline-ternary */
import React from 'react'
import ModuleHeader from '../../components/general/ModuleHeader'
import { Icon } from '@iconify/react/dist/iconify.js'
import Timer from './components/Timer'

export default function PomodoroTimer(): React.JSX.Element {
  return (
    <section className="flex h-full min-h-0 w-full flex-1 flex-col px-12">
      <ModuleHeader
        title="Pomodoro Timer"
        desc="Increase your productivity by using the Pomodoro technique."
      />
      <div className="mt-8 flex w-full flex-1">
        <Timer />
        <aside className="mb-12 w-2/6 overflow-y-scroll rounded-lg bg-bg-50 p-6 dark:bg-bg-900">
          <h1 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
            <Icon icon="tabler:circle-check" className="text-3xl" />
            <span className="ml-2">Things to do</span>
          </h1>
          <ul className="mt-6 flex flex-col gap-4">
            <li className="flex items-center justify-between gap-4 rounded-lg border-l-4 border-indigo-500 bg-bg-100 p-4 px-6 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900">
              <div className="flex flex-col gap-1">
                <div className="font-semibold text-bg-800">Buy groceries</div>
                <div className="text-sm text-rose-500">
                  10:00 AM, 23 Nov 2023 (overdue 8 hours)
                </div>
              </div>
              <button className="h-6 w-6 rounded-full border-2 border-bg-500 transition-all hover:border-orange-500" />
            </li>
            <li className="flex items-center justify-between gap-4 rounded-lg border-l-4 border-orange-500 bg-bg-100 p-4 px-6 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900">
              <div className="flex flex-col gap-1">
                <div className="font-semibold text-bg-800">Do homework</div>
                <div className="text-sm text-bg-500">00:00 AM, 31 Jan 2024</div>
              </div>
              <button className="h-6 w-6 rounded-full border-2 border-bg-500 transition-all hover:border-orange-500" />
            </li>
            <li className="flex items-center justify-between gap-4 rounded-lg border-l-4 border-orange-500 bg-bg-100 p-4 px-6 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900">
              <div className="flex flex-col gap-1">
                <div className="font-semibold text-bg-800">
                  Start doing revision for SPM Sejarah
                </div>
                <div className="text-sm text-bg-500">00:00 AM, 31 Jan 2024</div>
              </div>
              <button className="h-6 w-6 rounded-full border-2 border-bg-500 transition-all hover:border-orange-500" />
            </li>
          </ul>
        </aside>
      </div>
    </section>
  )
}
