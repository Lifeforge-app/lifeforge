import { faker } from '@faker-js/faker'
import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import APIComponentWithFallback from '@components/APIComponentWithFallback'
import Button from '@components/Button'
import ModuleHeader from '@components/ModuleHeader'
import ModuleWrapper from '@components/ModuleWrapper'
import SearchInput from '@components/SearchInput'
import useFetch from '@hooks/useFetch'
import { type IFlashcardDeck } from '@typedec/Flashcard'
import Sidebar from './components/Sidebar'

export default function Flashcards(): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [decks] = useFetch<IFlashcardDeck[]>('flashcards/deck/list')

  return (
    <ModuleWrapper>
      <ModuleHeader
        title="Flashcards"
        desc="Memorizing could be a pain, but not with flashcards."
      />
      <div className="mt-6 flex min-h-0 w-full flex-1">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex h-full flex-1 flex-col lg:ml-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold text-bg-800 dark:text-bg-100 md:text-4xl">
              All Decks <span className="text-base text-bg-500">(10)</span>
            </h1>
            <div className="flex items-center gap-6">
              <Button onClick={() => {}} icon="tabler:plus">
                new deck
              </Button>
              <button
                onClick={() => {}}
                className="-ml-4 rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200 dark:hover:bg-bg-800 dark:hover:text-bg-100 lg:hidden"
              >
                <Icon icon="tabler:menu" className="text-2xl" />
              </button>
            </div>
          </div>
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            stuffToSearch="tasks"
          />
          <APIComponentWithFallback data={decks}>
            {typeof decks !== 'string' && (
              <div className="mt-6 grid w-full grid-cols-3 gap-6 overflow-y-scroll px-4 pb-12">
                {decks.map(deck => (
                  <Link
                    to={`/flashcards/${deck.id}`}
                    key={deck.id}
                    className="group relative flex flex-col justify-start gap-6 rounded-lg bg-bg-50 p-8 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] hover:bg-bg-200/50 dark:bg-bg-900 dark:hover:bg-bg-800"
                  >
                    <div className="space-y-2">
                      {deck.tag !== '' && (
                        <span
                          className="relative isolate mb-1 w-min whitespace-nowrap rounded-full px-3 py-0.5 text-sm"
                          style={{
                            backgroundColor: `${deck.expand.tag.color}20`,
                            color: deck.expand.tag.color
                          }}
                        >
                          {deck.expand.tag.name}
                        </span>
                      )}
                      <div className="text-xl font-medium text-bg-800 dark:text-bg-100">
                        {deck.name}
                      </div>
                      <p className="text-sm font-medium text-bg-500">
                        {deck.card_amount} cards
                      </p>
                    </div>
                    <div className="mt-auto space-y-2">
                      <progress
                        className="progress h-2 w-full rounded-lg bg-bg-200 dark:bg-bg-700"
                        value={faker.datatype.number(100)}
                        max="100"
                      ></progress>
                      <p className="text-sm font-medium text-bg-500">
                        {faker.datatype.number(100)}% complete
                      </p>
                    </div>
                    <button className="absolute right-4 top-4 hidden rounded-md p-2 text-bg-500 hover:bg-bg-700/30 hover:text-bg-100 group-hover:flex">
                      <Icon icon="tabler:dots-vertical" className="h-5 w-5" />
                    </button>
                  </Link>
                ))}
                <div className="flex-center relative flex h-full flex-col gap-4 rounded-lg border-2 border-dashed border-bg-500 p-12">
                  <Icon icon="tabler:plus" className="h-8 w-8 text-bg-500" />
                  <div className="text-xl font-semibold text-bg-500">
                    Create new set
                  </div>
                </div>
              </div>
            )}
          </APIComponentWithFallback>
          {/* {Array(4)
              .fill(0)
              .map((_, index) => (
                <Link
                  to={`/idea-box/${index}`}
                  key={index}
                  className="group relative flex flex-col justify-start gap-6 rounded-lg bg-bg-50 p-8 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] transition-all hover:bg-bg-200/50 dark:bg-bg-900 dark:hover:bg-bg-800/50"
                >
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-bg-500">
                      {faker.datatype.number(100)} cards
                    </p>
                    <div className="text-xl font-medium text-bg-800 dark:text-bg-100">
                      {faker.commerce.productName()}
                    </div>
                  </div>
                  <div className="mt-auto flex flex-1 flex-center gap-2 text-custom-500">
                    <Icon icon="tabler:check" className="h-5 w-5" />
                    <p className="font-medium">Done</p>
                  </div>
                  <button className="absolute right-4 top-4 hidden rounded-md p-2 text-bg-500 hover:bg-bg-700/30 hover:text-bg-100 group-hover:flex">
                    <Icon icon="tabler:dots-vertical" className="h-5 w-5" />
                  </button>
                </Link>
              ))} */}
        </div>
      </div>
    </ModuleWrapper>
  )
}
