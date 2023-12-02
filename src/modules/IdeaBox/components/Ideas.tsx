import React from 'react'
import { Icon } from '@iconify/react'
import { Link } from 'react-router-dom'
import Column from 'react-columns'
import { faker } from '@faker-js/faker'

function Ideas(): React.JSX.Element {
  return (
    <section className="relative min-h-0 w-full min-w-0 flex-1 overflow-y-auto px-12">
      <div className="flex flex-col gap-1">
        <Link
          to="/idea-box"
          className="mb-2 flex w-min items-center gap-2 rounded-lg p-2 pl-0 pr-4 text-neutral-500 hover:text-neutral-100"
        >
          <Icon icon="tabler:chevron-left" className="text-xl" />
          <span className="whitespace-nowrap text-lg font-medium">Go back</span>
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-4 text-3xl font-semibold ">
            <div className="rounded-lg bg-teal-500/20 p-3">
              <Icon icon="tabler:hammer" className="text-3xl text-teal-500" />
            </div>
            LifeForge.
          </h1>
          <div className="flex items-center gap-4">
            <search className="flex w-96 items-center gap-4 rounded-lg bg-neutral-800/50 p-4">
              <Icon icon="tabler:search" className="h-5 w-5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search ideas ..."
                className="w-full bg-transparent text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
              />
            </search>
            <button className="rounded-lg p-4 text-neutral-500 transition-all hover:bg-neutral-800 hover:text-neutral-100">
              <Icon icon="tabler:dots-vertical" className="text-2xl" />
            </button>
          </div>
        </div>
      </div>
      <Column columns={4} gap="0.5rem" className="mt-8 h-max">
        {Array(100)
          .fill(0)
          .map((_, index) => {
            const random = Math.floor(Math.random() * 3)
            switch (random) {
              case 0:
                return (
                  <div className="relative">
                    <img
                      src={faker.image.urlPicsumPhotos({
                        width: 500 + Math.floor(Math.random() * 500),
                        height: 500 + Math.floor(Math.random() * 500)
                      })}
                      alt={faker.lorem.sentence()}
                      className="my-4 rounded-lg"
                    />
                    <button className="absolute right-2 top-2 shrink-0 rounded-lg bg-neutral-800/10 p-2 text-neutral-100 hover:bg-neutral-700/50 hover:text-neutral-100">
                      <Icon icon="tabler:dots-vertical" className="text-xl" />
                    </button>
                  </div>
                )
              case 1:
                return (
                  <div className="my-4 flex items-start justify-between gap-2 rounded-lg bg-neutral-800/50 p-4">
                    <p className="text-neutral-300">
                      {faker.lorem.paragraph()}
                    </p>
                    <button className="shrink-0 rounded-lg p-2 text-neutral-500 hover:bg-neutral-700/50 hover:text-neutral-100">
                      <Icon icon="tabler:dots-vertical" className="text-xl" />
                    </button>
                  </div>
                )
              case 2:
                return (
                  <div className="my-4 flex flex-col gap-2 rounded-lg bg-neutral-800/50 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xl font-semibold ">
                        {faker.lorem.words()}
                      </h3>
                      <button className="shrink-0 rounded-lg p-2 text-neutral-500 hover:bg-neutral-700/50 hover:text-neutral-100">
                        <Icon icon="tabler:dots-vertical" className="text-xl" />
                      </button>
                    </div>
                    <a
                      href={faker.internet.url()}
                      className="text-teal-500 underline underline-offset-2"
                    >
                      {faker.internet.url()}
                    </a>
                  </div>
                )
              default:
                return (
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between gap-2">
                      <h3 className="text-xl font-semibold ">
                        {faker.lorem.sentence()}
                      </h3>
                      <button className="shrink-0 rounded-lg p-2 hover:bg-neutral-700/50">
                        <Icon icon="tabler:dots-vertical" className="text-xl" />
                      </button>
                    </div>
                    <p className="text-neutral-300">
                      {faker.lorem.paragraph()}
                    </p>
                  </div>
                )
            }
          })}
      </Column>
      <button className="fixed bottom-6 right-6 flex items-center gap-2 rounded-lg bg-teal-500 p-4 px-6 pr-7 font-semibold uppercase tracking-wider text-neutral-800 shadow-lg hover:bg-teal-600">
        <Icon icon="tabler:plus" className="h-6 w-6 shrink-0" />
        <span className="shrink-0">add new</span>
      </button>
    </section>
  )
}

export default Ideas
