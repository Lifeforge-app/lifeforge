import { faker } from '@faker-js/faker'
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import { Link } from 'react-router-dom'
import ModuleHeader from '../../components/general/ModuleHeader'
import ModuleWrapper from '../../components/general/ModuleWrapper'

export default function Flashcards(): React.JSX.Element {
  return (
    <ModuleWrapper>
      <ModuleHeader
        title="Flashcards"
        desc="Memorizing could be a pain, but not with flashcards."
      />
      <div className="mt-8 flex min-h-0 w-full flex-1 flex-col">
        <search className="flex w-full items-center gap-4 rounded-lg bg-bg-50 p-4 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900">
          <Icon icon="tabler:search" className="h-5 w-5 text-bg-500" />
          <input
            type="text"
            placeholder="Search flashcard sets ..."
            className="w-full bg-transparent text-bg-500 placeholder:text-bg-400 focus:outline-none"
          />
        </search>
        <div className="mt-6 grid w-full grid-cols-3 gap-6 pb-12">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <Link
                to={`/flashcards/${index}`}
                key={index}
                className="relative flex flex-col justify-start gap-6 rounded-lg bg-bg-50 p-8 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] hover:bg-bg-200/50 dark:bg-bg-900 dark:hover:bg-bg-800"
              >
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-bg-400">
                    {faker.datatype.number(100)} cards
                  </p>
                  <div className="text-xl font-medium text-bg-800 dark:text-bg-100">
                    {faker.commerce.productName()}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <progress
                    className="progress h-2 w-full rounded-lg bg-bg-200 dark:bg-bg-700"
                    value={faker.datatype.number(100)}
                    max="100"
                  ></progress>
                  <p className="text-sm font-medium text-bg-400">
                    {faker.datatype.number(100)}% complete
                  </p>
                </div>
                <button className="absolute right-4 top-4 rounded-md p-2 text-bg-500 hover:bg-bg-700/30 hover:text-bg-100">
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
                className="relative flex flex-col justify-start gap-6 rounded-lg bg-bg-50 p-8 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] hover:bg-bg-200/50 dark:bg-bg-900 dark:hover:bg-bg-800"
              >
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-bg-400">
                    {faker.datatype.number(100)} cards
                  </p>
                  <div className="text-xl font-medium text-bg-800 dark:text-bg-100">
                    {faker.commerce.productName()}
                  </div>
                </div>
                <div className="flex flex-1 items-center justify-center gap-2 text-custom-500">
                  <Icon icon="tabler:check" className="h-5 w-5" />
                  <p className="font-medium">Done</p>
                </div>
                <button className="absolute right-4 top-4 rounded-md p-2 text-bg-500 hover:bg-bg-700/30 hover:text-bg-100">
                  <Icon icon="tabler:dots-vertical" className="h-5 w-5" />
                </button>
              </Link>
            ))}
          <div className="relative flex h-full flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-bg-400 p-12">
            <Icon icon="tabler:plus" className="h-8 w-8 text-bg-400" />
            <div className="text-xl font-semibold text-bg-400">
              Create new set
            </div>
          </div>
        </div>
      </div>
    </ModuleWrapper>
  )
}
