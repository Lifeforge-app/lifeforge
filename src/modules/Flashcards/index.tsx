/* eslint-disable sonarjs/pseudo-random */
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React, { useState } from 'react'
import { Link } from 'react-router'
import { Button } from '@components/buttons'
import { SearchInput } from '@components/inputs'
import ContentWrapperWithSidebar from '@components/layouts/module/ContentWrapperWithSidebar'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import SidebarAndContentWrapper from '@components/layouts/module/SidebarAndContentWrapper'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import Scrollbar from '@components/utilities/Scrollbar'
import useFetch from '@hooks/useFetch'
import useThemeColors from '@hooks/useThemeColor'
import { type IFlashcardDeck } from '@interfaces/flashcard_interfaces'
import Sidebar from './components/Sidebar'

export default function Flashcards(): React.ReactElement {
  const { componentBgWithHover } = useThemeColors()
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [decks] = useFetch<IFlashcardDeck[]>('flashcards/deck/list')

  return (
    <ModuleWrapper>
      <ModuleHeader icon="tabler:cards" title="Flashcards" />
      <SidebarAndContentWrapper>
        <Sidebar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
        <ContentWrapperWithSidebar>
          <div className="flex-between flex">
            <h1 className="text-3xl font-semibold md:text-4xl">
              All Decks <span className="text-bg-500 text-base">(10)</span>
            </h1>
            <div className="flex items-center gap-6">
              <Button icon="tabler:plus" onClick={() => {}}>
                new deck
              </Button>
              <button
                className="text-bg-500 hover:bg-bg-200 dark:hover:bg-bg-800 dark:hover:text-bg-50 -ml-4 rounded-lg p-4 transition-all lg:hidden"
                onClick={() => {}}
              >
                <Icon className="text-2xl" icon="tabler:menu" />
              </button>
            </div>
          </div>
          <SearchInput
            namespace="modules.flashcards"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            stuffToSearch="set"
          />
          <APIFallbackComponent data={decks}>
            {decks => (
              <Scrollbar>
                <div className="mt-6 grid w-full grid-cols-3 gap-6 px-4 pb-16">
                  {decks.map(deck => (
                    <Link
                      key={deck.id}
                      className={clsx(
                        'group shadow-custom relative flex flex-col justify-start gap-6 rounded-lg p-8',
                        componentBgWithHover
                      )}
                      to={`/flashcards/${deck.id}`}
                    >
                      <div className="space-y-2">
                        {deck.tag && (
                          <span
                            className="relative isolate mb-1 w-min rounded-full px-3 py-0.5 text-sm whitespace-nowrap"
                            style={{
                              backgroundColor: `${deck.expand.tag.color}20`,
                              color: deck.expand.tag.color
                            }}
                          >
                            {deck.expand.tag.name}
                          </span>
                        )}
                        <div className="text-xl font-medium">{deck.name}</div>
                        <p className="text-bg-500 text-sm font-medium">
                          {deck.card_amount} cards
                        </p>
                      </div>
                      <div className="mt-auto space-y-2">
                        <progress
                          className="progress bg-bg-200 dark:bg-bg-700 h-2 w-full rounded-lg"
                          max="100"
                          value={Math.floor(Math.random() * 100)}
                        ></progress>
                        <p className="text-bg-500 text-sm font-medium">
                          {Math.floor(Math.random() * 100)}% complete
                        </p>
                      </div>
                      <button className="text-bg-500 hover:bg-bg-700/30 hover:text-bg-50 absolute top-4 right-4 hidden rounded-md p-2 group-hover:flex">
                        <Icon className="size-5" icon="tabler:dots-vertical" />
                      </button>
                    </Link>
                  ))}
                  <div className="flex-center border-bg-500 relative h-full flex-col gap-4 rounded-lg border-2 border-dashed p-12">
                    <Icon className="text-bg-500 size-8" icon="tabler:plus" />
                    <div className="text-bg-500 text-xl font-semibold">
                      Create new set
                    </div>
                  </div>
                </div>
              </Scrollbar>
            )}
          </APIFallbackComponent>
          {/* {Array(4)
              .fill(0)
              .map((_, index) => (
                <Link
                  to={`/idea-box/${index}`}
                  key={index}
                  className="group relative flex flex-col justify-start gap-6 rounded-lg bg-bg-50 p-8 shadow-custom transition-all hover:bg-bg-100 dark:bg-bg-900 dark:hover:bg-bg-800/50"
                >
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-bg-500">
                      {faker.datatype.number(100)} cards
                    </p>
                    <div className="text-xl font-medium ">
                      {faker.commerce.productName()}
                    </div>
                  </div>
                  <div className="mt-auto flex flex-1 flex-center gap-2 text-custom-500">
                    <Icon icon="tabler:check" className="size-5" />
                    <p className="font-medium">Done</p>
                  </div>
                  <button className="absolute right-4 top-4 hidden rounded-md p-2 text-bg-500 hover:bg-bg-700/30 hover:text-bg-50 group-hover:flex">
                    <Icon icon="tabler:dots-vertical" className="size-5" />
                  </button>
                </Link>
              ))} */}
        </ContentWrapperWithSidebar>
      </SidebarAndContentWrapper>
    </ModuleWrapper>
  )
}
