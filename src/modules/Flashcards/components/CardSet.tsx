import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import { Link } from 'react-router-dom'

function CardSet(): React.JSX.Element {
  return (
    <section className="relative flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-y-auto px-12">
      <div className="flex flex-col gap-1">
        <Link
          to="/flashcards"
          className="mb-2 flex w-min items-center gap-2 rounded-lg p-2 pl-0 pr-4 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-100"
        >
          <Icon icon="tabler:chevron-left" className="text-xl" />
          <span className="whitespace-nowrap text-lg font-medium">Go back</span>
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="flex items-center text-3xl font-semibold ">
            华文年中考注释
            <span className="ml-4 rounded-full bg-custom-500/20 px-4 py-1.5 text-sm font-semibold text-custom-500">
              40 cards
            </span>
          </h1>
          <div className="flex items-center justify-center gap-2">
            <button className="rounded-lg p-4 text-neutral-100 transition-all hover:bg-neutral-800 hover:text-neutral-100">
              <Icon icon="tabler:border-corners" className="text-2xl" />
            </button>
            <button className="rounded-lg p-4 text-neutral-100 transition-all hover:bg-neutral-800 hover:text-neutral-100">
              <Icon icon="tabler:dots-vertical" className="text-2xl" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-1 flex-col items-center justify-center">
        <div className="flex h-1/2 w-3/5 items-center justify-center gap-4">
          <button className="flex h-full shrink-0 items-center justify-center p-4">
            <Icon icon="tabler:chevron-left" className="text-3xl" />
          </button>
          <div className="stack h-full w-full">
            <div className="card h-full bg-custom-500 text-neutral-800 shadow-md">
              <div className="card-body flex h-full flex-col">
                <h2 className="card-title text-custom-700">#1</h2>
                <div className="flex w-full flex-1 flex-col items-center justify-center text-3xl">
                  垂白上（偻）
                </div>
              </div>
            </div>
            <div className="card h-full bg-custom-700 text-neutral-800 !opacity-100 shadow"></div>
            <div className="card h-full bg-custom-900 text-neutral-800 !opacity-100 shadow-sm"></div>
          </div>
          <button className="flex h-full shrink-0 items-center justify-center p-4">
            <Icon icon="tabler:chevron-right" className="text-3xl" />
          </button>
        </div>
        <button className="mt-12 flex w-1/2 items-center justify-center gap-2 rounded-lg bg-neutral-200 p-4 text-lg font-medium shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-neutral-800">
          <Icon icon="tabler:bulb" className="text-2xl" />
          Show answer
        </button>
      </div>
    </section>
  )
}

export default CardSet
