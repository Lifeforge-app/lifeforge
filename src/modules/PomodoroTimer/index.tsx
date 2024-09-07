import { Icon } from '@iconify/react'
import React from 'react'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import Scrollbar from '@components/Scrollbar'
import Timer from './components/Timer'

export default function PomodoroTimer(): React.ReactElement {
  return (
    <ModuleWrapper>
      <ModuleHeader
        icon="tabler:clock-bolt"
        title="Pomodoro Timer"
        desc="Increase your productivity by using the Pomodoro technique."
      />
      <div className="mt-6 flex w-full flex-1">
        <Timer />
        <aside className="mb-12 w-2/6 rounded-lg bg-bg-50 p-6 dark:bg-bg-900">
          <Scrollbar>
            <h1 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
              <Icon icon="tabler:circle-check" className="text-3xl" />
              <span className="ml-2">Things to do</span>
            </h1>
            <ul className="mt-6 space-y-4">
              <li className="flex-between flex gap-4 rounded-lg border-l-4 border-indigo-500 bg-bg-100 p-4 px-6 shadow-custom dark:bg-bg-900">
                <div className="space-y-1">
                  <div className="font-semibold">Buy groceries</div>
                  <div className="text-sm text-rose-500">
                    10:00 AM, 23 Nov 2023 (overdue 8 hours)
                  </div>
                </div>
                <button className="size-6 rounded-full border-2 border-bg-500 transition-all hover:border-orange-500" />
              </li>
              <li className="flex-between flex gap-4 rounded-lg border-l-4 border-orange-500 bg-bg-100 p-4 px-6 shadow-custom dark:bg-bg-900">
                <div className="space-y-1">
                  <div className="font-semibold">Do homework</div>
                  <div className="text-sm text-bg-500">
                    00:00 AM, 31 Jan 2024
                  </div>
                </div>
                <button className="size-6 rounded-full border-2 border-bg-500 transition-all hover:border-orange-500" />
              </li>
              <li className="flex-between flex gap-4 rounded-lg border-l-4 border-orange-500 bg-bg-100 p-4 px-6 shadow-custom dark:bg-bg-900">
                <div className="space-y-1">
                  <div className="font-semibold">
                    Start doing revision for SPM Sejarah
                  </div>
                  <div className="text-sm text-bg-500">
                    00:00 AM, 31 Jan 2024
                  </div>
                </div>
                <button className="size-6 rounded-full border-2 border-bg-500 transition-all hover:border-orange-500" />
              </li>
            </ul>
          </Scrollbar>
        </aside>
      </div>
    </ModuleWrapper>
  )
}
