import { faker } from '@faker-js/faker'
import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import Button from '@components/Button'
import ModuleHeader from '@components/ModuleHeader'
import ModuleWrapper from '@components/ModuleWrapper'
import SearchInput from '@components/SearchInput'
import SidebarDivider from '@sidebar/components/SidebarDivider'
import SidebarItem from '@sidebar/components/SidebarItem'
import SidebarTitle from '@sidebar/components/SidebarTitle'

function ReferenceBooks(): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState('')
  return (
    <ModuleWrapper>
      <ModuleHeader
        title="Reference Books"
        desc="A collection of reference books that accompany you on your learning journey."
      />
      <div className="mb-12 mt-6 flex min-h-0 w-full flex-1">
        <aside className="h-full w-1/4 overflow-y-scroll rounded-lg bg-bg-50 py-4 dark:bg-bg-900">
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
                className="relative flex items-center gap-6 px-4 font-medium text-bg-500 transition-all"
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
            <SidebarDivider />
            <SidebarTitle name="languages" />
            {[
              ['emojione-monotone:flag-for-china', 'Chinese'],
              ['emojione-monotone:flag-for-united-kingdom', 'English']
            ].map(([icon, name], index) => (
              <li
                key={index}
                className="relative flex items-center gap-6 px-4 font-medium text-bg-500 transition-all"
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
            <h1 className="text-4xl font-semibold text-bg-100">
              All Books <span className="text-base text-bg-500">(10)</span>
            </h1>
            <Button icon="tabler:plus">upload</Button>
          </div>
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            stuffToSearch="books"
          />
          <ul className="mt-6 grid min-h-0 grid-cols-3 gap-6 gap-y-12 overflow-y-auto">
            {Array(10)
              .fill(0)
              .map((_, i) => (
                <li
                  key={i}
                  className="relative flex flex-col items-start rounded-lg"
                >
                  <div className="flex-center flex h-72 w-full rounded-lg bg-bg-50 p-8 dark:bg-bg-900">
                    <img
                      src={faker.image.imageUrl(300, 400, 'airport', true)}
                      alt={faker.lorem.sentence()}
                      className="h-full"
                    />
                  </div>
                  <div className="mt-4 text-xl font-medium text-bg-100">
                    {faker.commerce.productName()}
                  </div>
                  <div className="mt-2 text-sm font-medium text-bg-500">
                    {faker.person.fullName()}
                  </div>
                  <div className="mt-6 flex w-full flex-col gap-4">
                    <Button icon="tabler:book">Read</Button>
                    <Button icon="tabler:download" type="secondary">
                      Download
                    </Button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </ModuleWrapper>
  )
}

export default ReferenceBooks
