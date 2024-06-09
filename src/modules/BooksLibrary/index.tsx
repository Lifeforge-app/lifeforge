import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import GoBackButton from '@components/ButtonsAndInputs/GoBackButton'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import SidebarDivider from '@components/Sidebar/components/SidebarDivider'
import SidebarItem from '@components/Sidebar/components/SidebarItem'
import SidebarTitle from '@components/Sidebar/components/SidebarTitle'
import useFetch from '@hooks/useFetch'

function BooksLibrary(): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState('')
  const [books] = useFetch<any>('books-library/list')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [view, setView] = useState<'list' | 'grid'>('list')

  return (
    <ModuleWrapper>
      <ModuleHeader
        title="Books Library"
        desc="A collection of reference books that accompany you on your learning journey."
      />
      <div className="mt-6 flex min-h-0 w-full min-w-0 flex-1">
        <aside
          className={`absolute ${
            sidebarOpen ? 'left-0' : 'left-full'
          } top-0 z-[9999] h-full w-full shrink-0 overflow-y-scroll rounded-lg bg-bg-50 py-4 shadow-custom duration-300 dark:bg-bg-900 xl:static xl:h-[calc(100%-2rem)] xl:w-1/4`}
        >
          <div className="flex items-center justify-between px-8 py-4 xl:hidden">
            <GoBackButton
              onClick={() => {
                setSidebarOpen(false)
              }}
            />
          </div>
          <ul className="flex w-full min-w-0 flex-col overflow-y-hidden hover:overflow-y-scroll">
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
                className="relative flex w-full min-w-0 items-center gap-6 px-4 font-medium text-bg-500 transition-all"
              >
                <div className="flex w-full min-w-0 items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-800">
                  <Icon icon={icon} className="size-5 shrink-0 " />
                  <div className="w-full min-w-0 truncate">{name}</div>
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
                  <Icon icon={icon} className="size-5 shrink-0" />
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
        <div className="flex h-full min-h-0 flex-1 flex-col pb-8 xl:ml-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold text-bg-100 sm:text-4xl">
              All Books <span className="text-base text-bg-500">(10)</span>
            </h1>
            <Button
              onClick={() => {}}
              icon="tabler:plus"
              className="hidden sm:flex"
            >
              upload
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <SearchInput
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              stuffToSearch="books"
            />
            <div className="mt-2 flex items-center gap-2 rounded-md bg-bg-900 p-2 sm:mt-6">
              {['grid', 'list'].map(viewType => (
                <button
                  key={viewType}
                  onClick={() => {
                    setView(viewType as 'grid' | 'list')
                  }}
                  className={`flex items-center gap-2 rounded-md p-2 transition-all ${
                    viewType === view
                      ? 'bg-bg-800'
                      : 'text-bg-500 hover:text-bg-100'
                  }`}
                >
                  <Icon
                    icon={
                      viewType === 'grid'
                        ? 'uil:apps'
                        : viewType === 'list'
                        ? 'uil:list-ul'
                        : ''
                    }
                    className="size-6"
                  />
                </button>
              ))}
            </div>
          </div>
          <APIComponentWithFallback data={books}>
            {typeof books !== 'string' &&
              (view === 'grid' ? (
                <ul className="mt-6 grid min-h-0 gap-6 overflow-y-auto sm:grid-cols-2 md:grid-cols-3">
                  {books.map((item: any) => (
                    <li
                      key={item.id}
                      className="relative flex flex-col items-start rounded-lg"
                    >
                      <div className="flex-center flex h-72 w-full rounded-lg bg-bg-50 p-8 dark:bg-bg-900">
                        <img
                          src={`${
                            import.meta.env.VITE_API_HOST
                          }/books-library/cover/${item.cover}`}
                          className="h-full"
                        />
                      </div>
                      <div className="mt-4 text-xl font-medium text-bg-100">
                        {item.title}
                      </div>
                      <div className="mt-2 text-sm font-medium text-bg-500">
                        {item.authors}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="mt-6 flex flex-col gap-4 overflow-y-auto pb-8">
                  {books.map((item: any) => (
                    <li
                      key={item.id}
                      className="relative flex items-center gap-4 rounded-lg bg-bg-50 p-4 dark:bg-bg-900"
                    >
                      <div className="flex-center flex h-20 w-20 rounded-lg bg-bg-200 p-2 dark:bg-bg-800">
                        <img
                          src={`${
                            import.meta.env.VITE_API_HOST
                          }/books-library/cover/${item.cover}`}
                          className="h-full"
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="text-lg font-semibold text-bg-100">
                          {item.title}
                        </div>
                        <div className="text-sm font-medium text-bg-500">
                          {item.authors}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ))}
          </APIComponentWithFallback>
        </div>
      </div>
    </ModuleWrapper>
  )
}

export default BooksLibrary
