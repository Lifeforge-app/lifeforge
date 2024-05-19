import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import APIComponentWithFallback from '../../components/Screens/APIComponentWithFallback'
import Button from '../../components/ButtonsAndInputs/Button'
import EmptyStateScreen from '../../components/Screens/EmptyStateScreen'
import ModuleHeader from '../../components/Module/ModuleHeader'
import ModuleWrapper from '../../components/Module/ModuleWrapper'
import SearchInput from '../../components/ButtonsAndInputs/SearchInput'
import useFetch from '@hooks/useFetch'
import { type IJournalEntry } from '@typedec/Journal'

function Journal(): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState('')
  const [entries] = useFetch<IJournalEntry[]>('journal/entry/list')

  return (
    <ModuleWrapper>
      <ModuleHeader title="Journal" desc="..." />
      <div className="mt-6 flex min-h-0 w-full flex-1 flex-col">
        <div className="flex items-center gap-2">
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            stuffToSearch="daily journal entries"
          />
          <Button icon="tabler:plus" className="mt-6 shrink-0">
            New entry
          </Button>
        </div>
        <APIComponentWithFallback data={entries}>
          {typeof entries !== 'string' && entries.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-6">
              {entries.map(entry => (
                <Link
                  to={`/journal/view/${entry.id}`}
                  key={entry.id}
                  className="rounded-lg bg-bg-100 p-6 shadow-custom hover:bg-bg-200/50 dark:bg-bg-900 dark:hover:bg-bg-800/70"
                >
                  <div className="text-xl font-semibold text-custom-500">
                    {entry.title}
                  </div>
                  <div className="mt-2 line-clamp-2 text-bg-500">
                    {entry.content}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-6">
              <EmptyStateScreen
                title="No entries found"
                description="You haven't written any journal entries yet."
                icon="tabler:book-off"
                ctaContent="new entry"
                setModifyModalOpenType={() => {}}
              />
            </div>
          )}
        </APIComponentWithFallback>
      </div>
    </ModuleWrapper>
  )
}

export default Journal
