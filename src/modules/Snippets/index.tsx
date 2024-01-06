/* eslint-disable @typescript-eslint/indent */
import React from 'react'
import ModuleHeader from '../../components/ModuleHeader'
import { Icon } from '@iconify/react'
import { faker } from '@faker-js/faker'
import Sidebar from './components/Sidebar'

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

function Snippets(): React.JSX.Element {
  return (
    <section className="flex h-full min-h-0 w-full flex-1 flex-col px-12">
      <ModuleHeader
        title="Code Snippets"
        desc="Programming is basically just putting together a bunch of code snippets."
      />
      <div className="mb-12 mt-8 flex min-h-0 w-full flex-1">
        <Sidebar />
        <div className="ml-12 flex h-full min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-semibold text-neutral-800">
              All Snippets{' '}
              <span className="text-base text-neutral-400">(10)</span>
            </h1>
            <button className="flex shrink-0 items-center gap-2 rounded-lg bg-teal-500 p-4 pr-5 font-semibold uppercase tracking-wider text-neutral-100 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:text-neutral-800">
              <Icon icon="tabler:plus" className="h-5 w-5 shrink-0" />
              <span className="shrink-0">create</span>
            </button>
          </div>
          <search className="mt-6 flex w-full items-center gap-4 rounded-lg bg-neutral-50 p-4 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-neutral-800/50">
            <Icon icon="tabler:search" className="h-5 w-5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search snippets ..."
              className="w-full bg-transparent text-neutral-500 placeholder:text-neutral-400 focus:outline-none"
            />
          </search>
          <ul className="mt-6 flex min-h-0 flex-col gap-4 overflow-y-auto">
            {Array(10)
              .fill(0)
              .map((_, i) => (
                <li
                  key={i}
                  className="relative flex items-center justify-between gap-4 rounded-lg bg-neutral-50 p-6 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-neutral-800/50"
                >
                  <div className="flex w-full flex-col gap-1">
                    {(() => {
                      const randomLanguage = [
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
                        ['simple-icons:nodedotjs', 'Node.js', 'text-green-500'],
                        ['simple-icons:express', 'Express', 'text-gray-500']
                      ][Math.floor(Math.random() * 8)]

                      return (
                        <div
                          className={`-mt-1 mb-1 flex items-center gap-2 font-medium ${randomLanguage[2]}`}
                        >
                          <Icon icon={randomLanguage[0]} className="h-4 w-4" />
                          <span>{randomLanguage[1]}</span>
                        </div>
                      )
                    })()}
                    <div className="text-lg font-semibold text-neutral-800">
                      {faker.lorem.lines(1)}
                    </div>
                    <p className="text-neutral-500">
                      {faker.lorem.paragraphs(1)}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      {(() => {
                        let randomLabels = [
                          ['Important', 'bg-red-500/20', 'text-red-500'],
                          ['Shell Script', 'bg-green-500/20', 'text-green-500'],
                          ['Components', 'bg-blue-500/20', 'text-blue-500'],
                          ['Frontend', 'bg-fuchsia-500/20', 'text-fuchsia-500'],
                          ['API', 'bg-yellow-500/20', 'text-yellow-500']
                        ]

                        randomLabels = shuffle(randomLabels)

                        return randomLabels
                          .slice(0, Math.floor(Math.random() * 5))
                          .map(([name, bg, color], index) => (
                            <div
                              key={index}
                              className={`flex items-center gap-2 rounded-full px-4 py-1.5 ${bg} text-sm font-medium ${color}`}
                            >
                              {name}
                            </div>
                          ))
                      })()}
                    </div>
                  </div>
                  <button className="absolute right-4 top-4 rounded-md p-2 text-neutral-500 hover:bg-neutral-700/30 hover:text-neutral-100">
                    <Icon icon="tabler:dots-vertical" className="h-5 w-5" />
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Snippets
