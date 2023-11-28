import React, { useEffect, useState } from 'react'
import ModuleHeader from '../../components/ModuleHeader'
import { Icon } from '@iconify/react'
import { faker } from '@faker-js/faker'
import { Link } from 'react-router-dom'

function IdeaBox(): React.JSX.Element {
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
    <section className="flex h-full min-h-0 w-full flex-1 flex-col px-12">
      <ModuleHeader
        title="Idea Box"
        desc="Sometimes you will randomly stumble upon a great idea."
      />
      <div className="mt-8 flex min-h-0 w-full flex-1 flex-col">
        <search className="flex w-full items-center gap-4 rounded-lg bg-neutral-800/50 p-4">
          <Icon icon="tabler:search" className="h-5 w-5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search idea containers ..."
            className="w-full bg-transparent text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
          />
        </search>
        <div className="mt-6 grid w-full flex-1 grid-cols-4 gap-6 overflow-y-auto pb-12">
          {Array(9)
            .fill(0)
            .map((_, index) => (
              <Link
                to={`/idea-box/${index}`}
                key={index}
                className="relative flex flex-col items-center justify-start gap-6 rounded-lg bg-neutral-800/50 p-8 hover:bg-neutral-800"
              >
                {(() => {
                  const randomColor = [
                    ['bg-red-700/20', 'text-red-500'],
                    ['bg-orange-700/20', 'text-orange-500'],
                    ['bg-yellow-700/20', 'text-yellow-500'],
                    ['bg-green-700/20', 'text-green-500'],
                    ['bg-teal-700/20', 'text-teal-500'],
                    ['bg-blue-700/20', 'text-blue-500'],
                    ['bg-indigo-700/20', 'text-indigo-500'],
                    ['bg-purple-700/20', 'text-purple-500'],
                    ['bg-pink-700/20', 'text-pink-500'],
                    ['bg-rose-700/20', 'text-rose-500'],
                    ['bg-fuchsia-700/20', 'text-fuchsia-500']
                  ][Math.floor(Math.random() * 11)]

                  return (
                    <div className={`rounded-lg p-4 ${randomColor[0]}`}>
                      <Icon
                        icon={`tabler:${
                          icons[
                            Math.floor(Math.random() * icons.length)
                          ] as string
                        }`}
                        className={`h-8 w-8 ${randomColor[1]}`}
                      />
                    </div>
                  )
                })()}
                <div className="text-center text-2xl font-medium text-neutral-50">
                  {faker.commerce.productName()}
                </div>
                <div className="mt-auto flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="tabler:article"
                      className="h-5 w-5 text-neutral-500"
                    />
                    <span className="text-neutral-500">
                      {Math.floor(Math.random() * 100)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="tabler:link"
                      className="h-5 w-5 text-neutral-500"
                    />
                    <span className="text-neutral-500">
                      {Math.floor(Math.random() * 100)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="tabler:photo"
                      className="h-5 w-5 text-neutral-500"
                    />
                    <span className="text-neutral-500">
                      {Math.floor(Math.random() * 100)}
                    </span>
                  </div>
                </div>
                <button className="absolute right-4 top-4 rounded-md p-2 text-neutral-500 hover:bg-neutral-700/30 hover:text-neutral-100">
                  <Icon icon="tabler:dots-vertical" className="h-5 w-5" />
                </button>
              </Link>
            ))}
          <div className="relative flex h-full flex-col items-center justify-center gap-6 rounded-lg border-2 border-dashed border-neutral-700 p-8">
            <Icon
              icon="tabler:cube-plus"
              className="h-8 w-8 text-neutral-500"
            />
            <div className="text-xl font-semibold text-neutral-500">
              Create container
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default IdeaBox
