/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/indent */
import { faker } from '@faker-js/faker'
import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '@components/Button'
import ModuleHeader from '@components/ModuleHeader'
import ModuleWrapper from '@components/ModuleWrapper'
import SearchInput from '@components/SearchInput'
import SidebarDivider from '@sidebar/components/SidebarDivider'
import SidebarItem from '@sidebar/components/SidebarItem'
import SidebarTitle from '@sidebar/components/SidebarTitle'

function shuffle(array: any[]): any[] {
  let currentIndex = array.length
  let randomIndex

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex]
    ]
  }

  return array
}

function ProjectsM(): React.ReactElement {
  const [icons, setIcons] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetch('http://api.iconify.design/collection?prefix=tabler')
      .then(async response => await response.json())
      .then(data => {
        setIcons(data.uncategorized)
      })
      .catch(() => {})
  }, [])

  return (
    <ModuleWrapper>
      <ModuleHeader
        title="Projects (M)"
        desc="It's time to stop procrastinating."
      />
      <div className="mb-12 mt-6 flex min-h-0 w-full flex-1">
        <aside className="h-full w-1/4 overflow-hidden overflow-y-scroll rounded-lg bg-bg-50 py-4 shadow-custom dark:bg-bg-900">
          <ul className="flex flex-col overflow-y-hidden hover:overflow-y-scroll">
            <SidebarItem icon="tabler:list" name="All Projects" />
            <SidebarItem icon="tabler:star-filled" name="Starred" />
            <SidebarDivider />
            <SidebarTitle name="category" />
            {[
              ['tabler:world', 'Website'],
              ['tabler:device-mobile', 'Mobile App'],
              ['tabler:devices-pc', 'Desktop App']
            ].map(([icon, name], index) => (
              <li
                key={index}
                className="relative flex items-center gap-6 px-4 font-medium text-bg-500 transition-all"
              >
                <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-800">
                  <Icon icon={icon} className="h-6 w-6 shrink-0" />
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
            <SidebarTitle name="status" />
            {[
              ['tabler:zzz', 'Pending', 'bg-red-500'],
              ['tabler:circle-check', 'In Progress', 'bg-yellow-500'],
              ['tabler:circle-check', 'Completed', 'bg-green-500']
            ].map(([icon, name, color], index) => (
              <li
                key={index}
                className="relative flex items-center gap-6 px-4 font-medium text-bg-500 transition-all"
              >
                <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-200/50 dark:hover:bg-bg-800">
                  <span className={`block h-8 w-1.5 rounded-full ${color}`} />
                  <Icon icon={icon} className="h-6 w-6 shrink-0" />
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
            <SidebarTitle name="visibility" />
            {[
              ['tabler:brand-open-source', 'Open Source'],
              ['tabler:briefcase', 'Private & Commercial']
            ].map(([icon, name], index) => (
              <li
                key={index}
                className="relative flex items-center gap-6 px-4 font-medium text-bg-500 transition-all"
              >
                <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-200/50 dark:hover:bg-bg-800">
                  <Icon icon={icon} className="h-6 w-6 shrink-0" />
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
            <SidebarTitle name="Technologies" />
            {[
              ['simple-icons:react', 'React'],
              ['simple-icons:angular', 'Angular'],
              ['simple-icons:electron', 'Electron'],
              ['simple-icons:python', 'Python'],
              ['simple-icons:swift', 'Swift'],
              ['simple-icons:android', 'Android'],
              ['simple-icons:apple', 'iOS'],
              ['simple-icons:windows', 'Windows'],
              ['simple-icons:linux', 'Linux']
            ].map(([icon, name], index) => (
              <li
                key={index}
                className="relative flex items-center gap-6 px-4 font-medium text-bg-500 transition-all"
              >
                <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-200/50 dark:hover:bg-bg-800">
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
        <div className="ml-8 flex h-full flex-1 flex-col">
          <div className="mx-4 flex items-center justify-between">
            <h1 className="text-4xl font-semibold text-bg-800 dark:text-bg-100">
              All Projects <span className="text-base text-bg-500">(10)</span>
            </h1>
            <Button icon="tabler:plus">create</Button>
          </div>
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            stuffToSearch="projects"
          />
          <div className="mt-6 flex flex-1 flex-col overflow-y-auto">
            <ul className="flex flex-col">
              {Array(10)
                .fill(0)
                .map((_, i) => (
                  <li
                    key={i}
                    className="m-4 mt-0 flex items-center gap-4 rounded-lg bg-bg-50 p-6 shadow-custom dark:bg-bg-900"
                  >
                    <Link
                      to="./lifeforge"
                      className="flex w-full items-center justify-between gap-4"
                    >
                      <div className="flex w-2/5 items-center gap-4">
                        <div
                          className={`h-10 w-1 shrink-0 rounded-full ${
                            ['bg-green-500', 'bg-yellow-500', 'bg-red-500'][
                              Math.floor(Math.random() * 3)
                            ]
                          }`}
                        />
                        <div
                          className={`h-12 w-12 overflow-hidden rounded-lg p-2 ${
                            [
                              'bg-red-500/20 text-red-500',
                              'bg-yellow-500/20 text-yellow-500',
                              'bg-green-500/20 text-green-500',
                              'bg-blue-500/20 text-blue-500',
                              'bg-indigo-500/20 text-indigo-500',
                              'bg-purple-500/20 text-purple-500',
                              'bg-pink-500/20 text-pink-500',
                              'bg-rose-500/20 text-rose-500',
                              'bg-fuchsia-500/20 text-fuchsia-500',
                              'bg-orange-500/20 text-orange-500',
                              'bg-cyan-500/20 text-cyan-500',
                              'bg-sky-500/20 text-sky-500',
                              'bg-lime-500/20 text-lime-500',
                              'bg-amber-500/20 text-amber-500',
                              'bg-emerald-500/20 text-emerald-500',
                              'bg-custom-500/20 text-custom-500'
                            ][Math.floor(Math.random() * 16)]
                          }`}
                        >
                          <Icon
                            icon={`tabler:${
                              icons[
                                Math.floor(Math.random() * icons.length)
                              ] as string
                            }`}
                            className="h-full w-full"
                          />
                        </div>
                        <div className="flex flex-col items-start">
                          <div className="font-semibold text-bg-800 dark:text-bg-100">
                            {faker.commerce.productName()}
                          </div>
                          <div className="text-sm text-bg-500">
                            {
                              ['Website', 'Mobile App', 'Desktop App'][
                                Math.floor(Math.random() * 3)
                              ]
                            }
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {(() => {
                          let randomLanguage = [
                            ['simple-icons:react', 'React', 'text-sky-500'],
                            [
                              'simple-icons:typescript',
                              'TypeScript',
                              'text-blue-500'
                            ],
                            [
                              'simple-icons:javascript',
                              'JavaScript',
                              'text-yellow-500'
                            ],
                            ['simple-icons:html5', 'HTML', 'text-orange-500'],
                            ['simple-icons:css3', 'CSS', 'text-blue-500'],
                            [
                              'simple-icons:tailwindcss',
                              'Tailwind',
                              'text-cyan-500'
                            ],
                            [
                              'simple-icons:nodedotjs',
                              'Node.js',
                              'text-green-500'
                            ],
                            ['simple-icons:express', 'Express', 'text-gray-500']
                          ]

                          randomLanguage = shuffle(randomLanguage)

                          return randomLanguage
                            .slice(0, Math.floor(Math.random() * 5 + 2))
                            .map(([name, bg, color], index) => (
                              <div
                                key={index}
                                className={`flex items-center gap-2 rounded-full ${bg} text-sm font-medium ${color}`}
                              >
                                <Icon icon={name} className="h-5 w-5" />
                              </div>
                            ))
                        })()}
                      </div>
                      <div className="flex items-center gap-4 ">
                        <Icon
                          icon="tabler:chevron-right"
                          className="h-5 w-5 stroke-[2px] text-bg-500"
                        />
                      </div>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </ModuleWrapper>
  )
}

export default ProjectsM
