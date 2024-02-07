import React from 'react'
import ModuleHeader from '../../components/general/ModuleHeader'
import { Icon } from '@iconify/react/dist/iconify.js'
import SidebarItem from '../../components/Sidebar/components/SidebarItem'
import SidebarDivider from '../../components/Sidebar/components/SidebarDivider'
import SidebarTitle from '../../components/Sidebar/components/SidebarTitle'
import { faker } from '@faker-js/faker'
import ModuleWrapper from '../../components/general/ModuleWrapper'

export default function Resources(): React.JSX.Element {
  return (
    <ModuleWrapper>
      <ModuleHeader
        title="Resources"
        desc="A collection of useful stuff for your coding journey."
      />
      <div className="mb-12 mt-8 flex min-h-0 w-full flex-1">
        <aside className="h-full w-1/4 overflow-y-scroll rounded-lg bg-bg-50 py-4 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900">
          <ul className="flex flex-col overflow-y-hidden hover:overflow-y-scroll">
            <SidebarItem icon="tabler:list" name="All Resources" />
            <SidebarItem icon="tabler:star-filled" name="Starred" />
            <SidebarDivider />
            <SidebarTitle name="categories" />
            {[
              ['simple-icons:react', 'React Libraries'],
              ['tabler:database', 'Databases'],
              ['tabler:device-desktop-code', 'UI Frameworks'],
              ['tabler:terminal', 'Command Line Tools'],
              ['tabler:server', 'Servers']
            ].map(([icon, name], index) => (
              <li
                key={index}
                className="relative flex items-center gap-6 px-4 font-medium text-bg-400 transition-all"
              >
                <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-800">
                  <Icon icon={icon} className="h-5 w-5 shrink-0" />
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
        </aside>
        <div className="ml-12 flex h-full min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-semibold text-bg-800 dark:text-bg-100">
              All Resources <span className="text-base text-bg-400">(10)</span>
            </h1>
            <button className="flex shrink-0 items-center gap-2 rounded-lg bg-custom-500 p-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 dark:text-bg-800">
              <Icon icon="tabler:plus" className="h-5 w-5 shrink-0" />
              <span className="shrink-0">add new</span>
            </button>
          </div>
          <search className="mt-6 flex w-full items-center gap-4 rounded-lg bg-bg-50 p-4 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900">
            <Icon icon="tabler:search" className="h-5 w-5 text-bg-500" />
            <input
              type="text"
              placeholder="Search resources ..."
              className="w-full bg-transparent text-bg-500 placeholder:text-bg-400 focus:outline-none"
            />
          </search>
          <ul className="mt-6 flex min-h-0 flex-col gap-4 overflow-y-auto">
            {Array(10)
              .fill(0)
              .map((_, i) => (
                <li
                  key={i}
                  className="relative flex items-center justify-between gap-4 rounded-lg bg-bg-50 p-6 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900"
                >
                  <div className="flex w-full flex-col gap-1">
                    {(() => {
                      const randomCategory = [
                        ['simple-icons:react', 'React Libraries'],
                        ['tabler:database', 'Databases'],
                        ['tabler:device-desktop-code', 'UI Frameworks'],
                        ['tabler:terminal', 'Command Line Tools'],
                        ['tabler:server', 'Servers']
                      ][Math.floor(Math.random() * 5)]

                      return (
                        <div
                          className={
                            '-mt-1 mb-1 flex items-center gap-2 font-medium text-bg-500'
                          }
                        >
                          <Icon icon={randomCategory[0]} className="h-4 w-4" />
                          <span>{randomCategory[1]}</span>
                        </div>
                      )
                    })()}
                    <div className="text-lg font-semibold text-bg-800">
                      {faker.lorem.words(Math.floor(Math.random() * 5) + 1)}
                    </div>
                    <p className="text-bg-500">{faker.lorem.paragraphs(1)}</p>
                  </div>
                  <button className="absolute right-4 top-4 rounded-md p-2 text-bg-100 hover:bg-bg-700/30 hover:text-bg-100">
                    <Icon icon="tabler:dots-vertical" className="h-5 w-5" />
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </ModuleWrapper>
  )
}
