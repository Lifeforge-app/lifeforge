/* eslint-disable multiline-ternary */
import React, { useState } from 'react'
import ModuleHeader from '../../components/ModuleHeader'
import { Icon } from '@iconify/react/dist/iconify.js'

export default function PomodoroTimer(): React.JSX.Element {
  const [started, setStarted] = useState(false)

  return (
    <section className="flex h-full min-h-0 w-full flex-1 flex-col px-12">
      <ModuleHeader
        title="Pomodoro Timer"
        desc="Increase your productivity by using the Pomodoro technique."
      />
      <div className="mt-8 flex w-full flex-1">
        <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-12">
          <div className="relative flex flex-col items-center justify-center">
            <div
              className="radial-progress absolute text-neutral-800/50"
              style={{
                '--value': '100',
                '--size': '28rem',
                '--thickness': '20px'
              }}
              role="progressbar"
            ></div>
            <div
              className="radial-progress flex items-center justify-center text-amber-500"
              style={{
                '--value': '70',
                '--size': '28rem',
                '--thickness': '20px'
              }}
              role="progressbar"
            >
              <div className="z-[9999] mt-12 flex flex-col items-center gap-4 text-neutral-100">
                <span className="text-7xl font-medium tracking-widest">
                  02:33
                </span>
                <span className="text-lg font-medium uppercase tracking-widest text-amber-500">
                  short break
                </span>
                {started ? (
                  <span className="text-lg font-medium tracking-widest text-neutral-500">
                    #8
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setStarted(true)
                    }}
                    className="rounded-lg p-4 text-neutral-100 hover:bg-neutral-800/50"
                  >
                    <Icon icon="tabler:play" className="h-8 w-8 shrink-0" />
                  </button>
                )}
              </div>
            </div>
          </div>
          {started && (
            <div className="flex items-center gap-6">
              <button className="flex shrink-0 items-center gap-2 rounded-lg bg-amber-500 p-4 px-6 pr-7 font-semibold uppercase tracking-wider text-neutral-800">
                <Icon icon="tabler:pause" className="h-5 w-5 shrink-0" />
                <span className="shrink-0">pause session</span>
              </button>
              <button
                onClick={() => {
                  setStarted(false)
                }}
                className="flex shrink-0 items-center gap-2 rounded-lg bg-neutral-800 p-4 px-6 pr-7 font-semibold uppercase tracking-wider text-neutral-400 hover:bg-neutral-700/50"
              >
                <Icon icon="tabler:square" className="h-5 w-5 shrink-0" />
                <span className="shrink-0">end session</span>
              </button>
            </div>
          )}
        </div>
        <aside className="mb-12 w-2/6 overflow-y-scroll rounded-lg bg-neutral-800/50 p-6">
          <h1 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
            <Icon icon="tabler:circle-check" className="text-3xl" />
            <span className="ml-2">Things to do</span>
          </h1>
          <ul className="mt-6 flex flex-col gap-4">
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
        </aside>
      </div>
    </section>
  )
}
