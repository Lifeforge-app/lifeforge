import React from 'react'
import SidebarDivider from '../../../components/Sidebar/components/SidebarDivider'
import SidebarTitle from '../../../components/Sidebar/components/SidebarTitle'
import { Icon } from '@iconify/react'

function Sidebar(): React.JSX.Element {
  return (
    <aside className="h-full w-1/4 overflow-y-scroll rounded-lg bg-neutral-50 py-4 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-neutral-800/50">
      <ul className="flex flex-col overflow-y-hidden hover:overflow-y-scroll">
        <SidebarTitle name="tasks" />
        {[
          ['tabler:article', 'All'],
          ['tabler:calendar-exclamation', 'Today'],
          ['tabler:calendar-up', 'Upcoming'],
          ['tabler:calendar-x', 'Overdue'],
          ['tabler:calendar-check', 'Completed']
        ].map(([icon, name], index) => (
          <li
            key={index}
            className="relative flex items-center gap-6 px-4 font-medium text-neutral-400 transition-all"
          >
            <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-neutral-200/50 dark:hover:bg-neutral-800">
              <Icon icon={icon} className="h-6 w-6 shrink-0" />
              <div className="flex w-full items-center justify-between">
                {name}
              </div>
              <span className="text-sm">{Math.floor(Math.random() * 10)}</span>
            </div>
          </li>
        ))}
        <SidebarDivider />
        <SidebarTitle name="categories" />
        {[
          ['tabler:code', 'Code', 'bg-green-500'],
          ['tabler:book', 'Study', 'bg-blue-500'],
          ['tabler:clipboard-list', 'Work', 'bg-yellow-500'],
          ['tabler:heart', 'Health', 'bg-red-500'],
          ['tabler:shopping-cart', 'Shopping', 'bg-purple-500'],
          ['tabler:coffee', 'Leisure', 'bg-pink-500']
        ].map(([icon, name, color], index) => (
          <li
            key={index}
            className="relative flex items-center gap-6 px-4 font-medium text-neutral-400 transition-all"
          >
            <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-neutral-200/50 dark:hover:bg-neutral-800">
              <span className={`block h-8 w-1.5 rounded-full ${color}`} />
              <Icon icon={icon} className="h-6 w-6 shrink-0" />
              <div className="flex w-full items-center justify-between">
                {name}
              </div>
              <span className="text-sm">{Math.floor(Math.random() * 10)}</span>
            </div>
          </li>
        ))}
        <SidebarDivider />
        <SidebarTitle name="Tags" />
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
                className={`block h-2 w-2 shrink-0 rounded-full ${color}`}
              />
              <div className="flex w-full items-center justify-between">
                {name}
              </div>
              <span className="text-sm">{Math.floor(Math.random() * 10)}</span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default Sidebar
