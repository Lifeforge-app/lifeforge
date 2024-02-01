import { faker } from '@faker-js/faker'
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import ModuleHeader from '../../components/general/ModuleHeader'
import SidebarDivider from '../../components/Sidebar/components/SidebarDivider'
import SidebarItem from '../../components/Sidebar/components/SidebarItem'
import SidebarTitle from '../../components/Sidebar/components/SidebarTitle'

function ReferenceBooks(): React.JSX.Element {
  return (
    <section className="flex h-full min-h-0 w-full flex-1 flex-col px-12">
      <ModuleHeader
        title="Reference Books"
        desc="A collection of reference books that accompany you on your learning journey."
      />
      <div className="mb-12 mt-8 flex min-h-0 w-full flex-1">
        <aside className="h-full w-1/4 overflow-y-scroll rounded-lg bg-neutral-50 py-4 dark:bg-neutral-800/50">
          <ul className="flex flex-col overflow-y-hidden hover:overflow-y-scroll">
            <SidebarItem icon="tabler:list" name="All books" />
            <SidebarItem icon="tabler:star-filled" name="Starred" />
            <SidebarDivider />
            <SidebarTitle name="categories" />
            {[
              ['tabler:math-integral-x', 'Calculus'],
              ['tabler:math-pi', 'Mathematics'],
              ['tabler:atom', 'Physics'],
              ['tabler:code', 'Computer Science']
            ].map(([icon, name], index) => (
              <li
                key={index}
                className="relative flex items-center gap-6 px-4 font-medium text-neutral-400 transition-all"
              >
                <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-neutral-800">
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
            <SidebarDivider />
            <SidebarTitle name="languages" />
            {[
              ['emojione-monotone:flag-for-china', 'Chinese'],
              ['emojione-monotone:flag-for-united-kingdom', 'English']
            ].map(([icon, name], index) => (
              <li
                key={index}
                className="relative flex items-center gap-6 px-4 font-medium text-neutral-400 transition-all"
              >
                <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-neutral-800">
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
            <h1 className="text-4xl font-semibold text-neutral-100">
              All Books <span className="text-base text-neutral-400">(10)</span>
            </h1>
            <button className="flex shrink-0 items-center gap-2 rounded-lg bg-custom-500 p-4 pr-5 font-semibold uppercase tracking-wider text-neutral-800">
              <Icon icon="tabler:plus" className="h-5 w-5 shrink-0" />
              <span className="shrink-0">upload</span>
            </button>
          </div>
          <search className="mt-6 flex w-full items-center gap-4 rounded-lg bg-neutral-50 p-4 dark:bg-neutral-800/50">
            <Icon icon="tabler:search" className="h-5 w-5 text-neutral-100" />
            <input
              type="text"
              placeholder="Search books ..."
              className="w-full bg-transparent text-neutral-100 placeholder:text-neutral-100 focus:outline-none"
            />
          </search>
          <ul className="mt-6 grid min-h-0 grid-cols-3 gap-6 gap-y-12 overflow-y-auto">
            {Array(10)
              .fill(0)
              .map((_, i) => (
                <li
                  key={i}
                  className="relative flex flex-col items-start rounded-lg"
                >
                  <div className="flex h-72 w-full items-center justify-center rounded-lg bg-neutral-50 p-8 dark:bg-neutral-800/50">
                    <img
                      src={faker.image.imageUrl(300, 400, 'airport', true)}
                      alt={faker.lorem.sentence()}
                      className="h-full"
                    />
                  </div>
                  <div className="mt-4 text-xl font-medium text-neutral-100">
                    {faker.commerce.productName()}
                  </div>
                  <div className="mt-2 text-sm font-medium text-neutral-400">
                    {faker.person.fullName()}
                  </div>
                  <div className="mt-6 flex w-full flex-col gap-4">
                    <button className="flex items-center justify-center gap-2 rounded-lg bg-custom-500 p-4 pr-5 font-semibold uppercase tracking-wider text-neutral-800">
                      <Icon icon="tabler:book" className="h-5 w-5 shrink-0" />
                      <span className="shrink-0">read</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 rounded-lg bg-neutral-800 p-4 pr-5 font-semibold uppercase tracking-wider">
                      <Icon
                        icon="tabler:download"
                        className="h-5 w-5 shrink-0"
                      />
                      <span className="shrink-0">download</span>
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default ReferenceBooks
