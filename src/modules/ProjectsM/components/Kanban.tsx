import { Icon } from '@iconify/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import GoBackButton from '@components/GoBackButton'

function Kanban(): React.ReactElement {
  const navigate = useNavigate()

  return (
    <section className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-y-auto pl-12">
      <div className="flex flex-col gap-1 pr-12">
        <GoBackButton
          onClick={() => {
            navigate('/projects')
          }}
        />
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-4 text-3xl font-semibold dark:text-bg-100">
            <div className="rounded-lg bg-custom-500/20 p-3 text-custom-500 dark:bg-bg-800">
              <Icon icon="tabler:hammer" className="text-3xl" />
            </div>
            LifeForge.
            <div className="ml-2 rounded-full bg-yellow-500/20 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-yellow-500 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)]">
              In progress
            </div>
          </h1>
          <div className="flex gap-2 rounded-lg p-2">
            {[
              'tabler:layout-columns',
              'tabler:layout-list',
              'tabler:arrow-autofit-content'
            ].map((icon, index) => (
              <button
                key={index}
                className={`rounded-md p-4 ${
                  index === 0
                    ? 'bg-bg-300/50 dark:bg-bg-700/50 dark:text-bg-100'
                    : 'text-bg-500 hover:bg-bg-200/50 dark:hover:bg-bg-700/50'
                }`}
              >
                <Icon icon={icon} className="text-2xl" />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mb-12 mt-6 flex min-h-0 min-w-0 flex-1 gap-4 overflow-x-auto overflow-y-hidden">
        {[
          ['tabler:brain', 'Brainstorm', 'border-fuchsia-500'],
          ['tabler:settings', 'In Progress', 'border-yellow-500'],
          ['tabler:check', 'Done', 'border-green-500'],
          ['tabler:bug', 'Bugs', 'border-red-500']
        ].map(([icon, name, color], i) => (
          <div
            key={i}
            className={`flex h-min max-h-full w-72 shrink-0 flex-col rounded-lg border-t-4 bg-bg-50 p-6 pb-0 pr-4 dark:bg-bg-900 ${color}`}
          >
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-4">
                <Icon icon={icon} className="text-2xl" />
                <span className="text-xl font-semibold text-bg-800 dark:text-bg-100">
                  {name}
                </span>
              </h3>
              <button className="rounded-lg p-2 hover:bg-bg-700/50">
                <Icon icon="tabler:dots-vertical" className="text-xl" />
              </button>
            </div>
            <ul className="mt-6 space-y-2 overflow-y-auto pr-2">
              {Array(Math.floor(Math.random() * 10))
                .fill(0)
                .map((_, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-4 rounded-lg bg-bg-100 p-4 shadow-[2px_2px_3px_rgba(0,0,0,0.05)] hover:bg-bg-700/50 dark:bg-bg-700/30"
                  >
                    <span className="text-bg-800 dark:text-bg-100">
                      {
                        [
                          'Lorem ipsum dolor sit amet',
                          'consectetur adipiscing elit',
                          'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
                          'Ut enim ad minim veniam'
                        ][Math.floor(Math.random() * 4)]
                      }
                    </span>
                  </li>
                ))}
              <li className="flex items-center justify-center">
                <button className="mb-4 flex w-full items-center gap-2 rounded-lg border-bg-500 p-4 pl-3 font-medium text-bg-500 hover:bg-bg-700/30">
                  <Icon icon="tabler:plus" className="text-xl" />
                  <span>Add a card</span>
                </button>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Kanban
