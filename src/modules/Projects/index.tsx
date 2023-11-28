/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/indent */
import React, { useEffect, useState } from 'react'
import ModuleHeader from '../../components/ModuleHeader'
import SidebarTitle from '../../components/Sidebar/components/SidebarTitle'
import SidebarDivider from '../../components/Sidebar/components/SidebarDivider'
import { Icon } from '@iconify/react'
import { Link } from 'react-router-dom'
import SidebarItem from '../../components/Sidebar/components/SidebarItem'
import { faker } from '@faker-js/faker'

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

function Projects(): React.JSX.Element {
  const [icons, setIcons] = useState([])

  useEffect(() => {
    fetch('http://api.iconify.design/collection?prefix=tabler')
      .then(async response => await response.json())
      .then(data => {
        setIcons(data.uncategorized)
      })
      .catch(() => {})
  }, [])

  return (
    <section className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-y-auto px-12">
      <ModuleHeader
        title="Projects"
        desc="It's time to stop procrastinating."
      />
      <div className="mb-12 mt-8 flex min-h-0 w-full flex-1">
        <aside className="h-full w-1/4 overflow-y-scroll rounded-lg bg-neutral-800/50 py-4">
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
                className="relative flex items-center gap-6 px-4 font-medium text-neutral-400 transition-all"
              >
                <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-neutral-800">
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
                className="relative flex items-center gap-6 px-4 font-medium text-neutral-400 transition-all"
              >
                <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-neutral-800">
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
                className="relative flex items-center gap-6 px-4 font-medium text-neutral-400 transition-all"
              >
                <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-neutral-800">
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
        <div className="ml-12 flex h-full flex-1 flex-col">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-semibold text-neutral-50">
              All Projects{' '}
              <span className="text-base text-neutral-400">(10)</span>
            </h1>
            <button className="flex shrink-0 items-center gap-2 rounded-lg bg-teal-500 p-4 pr-5 font-semibold uppercase tracking-wider text-neutral-100">
              <Icon icon="tabler:plus" className="h-5 w-5 shrink-0" />
              <span className="shrink-0">create</span>
            </button>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <search className="flex w-full items-center gap-4 rounded-lg bg-neutral-800/50 p-4">
              <Icon icon="tabler:search" className="h-5 w-5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search projects ..."
                className="w-full bg-transparent text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
              />
            </search>
          </div>
          <div className="mt-6 flex flex-1 flex-col overflow-y-auto">
            <ul className="flex flex-col gap-4">
              {Array(10)
                .fill(0)
                .map((_, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-4 rounded-lg bg-neutral-800/50 p-6"
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
                        <div className="h-12 w-12 overflow-hidden rounded-lg bg-neutral-800 p-2">
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
                          <div className="font-semibold text-neutral-50">
                            {faker.commerce.productName()}
                          </div>
                          <div className="text-sm text-neutral-500">
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
                          className="h-5 w-5 stroke-[2px] text-neutral-400"
                        />
                      </div>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Projects
