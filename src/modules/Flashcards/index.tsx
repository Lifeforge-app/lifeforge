import { faker } from '@faker-js/faker'
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import { Link } from 'react-router-dom'
import ModuleHeader from '../../components/ModuleHeader'

export default function Flashcards(): React.JSX.Element {
  return (
    <section className="flex h-full min-h-0 w-full flex-1 flex-col px-12">
      <ModuleHeader
        title="Flashcards"
        desc="Memorizing could be a pain, but not with flashcards."
      />
      <div className="mt-8 flex min-h-0 w-full flex-1 flex-col">
        <search className="flex w-full items-center gap-4 rounded-lg bg-neutral-50 p-4 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-neutral-800/50">
          <Icon icon="tabler:search" className="h-5 w-5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search flashcard sets ..."
            className="w-full bg-transparent text-neutral-500 placeholder:text-neutral-400 focus:outline-none"
          />
        </search>
        <div className="mt-6 grid w-full grid-cols-3 gap-6 overflow-y-auto pb-12">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <Link
                to={`/flashcards/${index}`}
                key={index}
                className="relative flex flex-col justify-start gap-6 rounded-lg bg-neutral-50 p-8 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] hover:bg-neutral-200/50 dark:bg-neutral-800/50 dark:hover:bg-neutral-800"
              >
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-neutral-400">
                    {faker.datatype.number(100)} cards
                  </p>
                  <div className="text-xl font-medium text-neutral-800">
                    {faker.commerce.productName()}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <progress
                    className="progress h-2 w-full rounded-lg bg-neutral-200"
                    value={faker.datatype.number(100)}
                    max="100"
                  ></progress>
                  <p className="text-sm font-medium text-neutral-400">
                    {faker.datatype.number(100)}% complete
                  </p>
                </div>
                <button className="absolute right-4 top-4 rounded-md p-2 text-neutral-500 hover:bg-neutral-700/30 hover:text-neutral-100">
                  <Icon icon="tabler:dots-vertical" className="h-5 w-5" />
                </button>
              </Link>
            ))}
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <Link
                to={`/idea-box/${index}`}
                key={index}
                className="relative flex flex-col justify-start gap-6 rounded-lg bg-neutral-50 p-8 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] hover:bg-neutral-200/50 dark:bg-neutral-800/50 dark:hover:bg-neutral-800"
              >
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-neutral-400">
                    {faker.datatype.number(100)} cards
                  </p>
                  <div className="text-xl font-medium text-neutral-800">
                    {faker.commerce.productName()}
                  </div>
                </div>
                <div className="flex flex-1 items-center justify-center gap-2 text-teal-500">
                  <Icon icon="tabler:check" className="h-5 w-5" />
                  <p className="font-medium">Done</p>
                </div>
                <button className="absolute right-4 top-4 rounded-md p-2 text-neutral-500 hover:bg-neutral-700/30 hover:text-neutral-100">
                  <Icon icon="tabler:dots-vertical" className="h-5 w-5" />
                </button>
              </Link>
            ))}
          <div className="relative flex h-full flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-neutral-400 p-12">
            <Icon icon="tabler:plus" className="h-8 w-8 text-neutral-400" />
            <div className="text-xl font-semibold text-neutral-400">
              Create new set
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
