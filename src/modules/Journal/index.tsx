import moment from 'moment'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '@components/ButtonsAndInputs/Button'
import FAB from '@components/ButtonsAndInputs/FAB'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import useFetch from '@hooks/useFetch'
import { type IJournalEntry } from '@typedec/Journal'
import APIRequest from '@utils/fetchData'

function Journal(): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState('')
  const [entries, refreshEntries] =
    useFetch<IJournalEntry[]>('journal/entry/list')
  const [loading, setLoading] = useState(false)
  const [existedData, setExistedData] = useState<IJournalEntry | null>(null)
  const [isDeleteEntryConfirmModalOpen, setIsDeleteEntryConfirmModalOpen] =
    useState(false)
  const navigate = useNavigate()

  async function createEntry(): Promise<void> {
    setLoading(true)
    await APIRequest({
      endpoint: 'journal/entry/create',
      method: 'POST',
      body: {
        title: moment().format('MMMM DD, YYYY'),
        content: 'Write your content here'
      },
      successInfo: 'Yay! Entry created successfully',
      failureInfo: "Oops! Couldn't create the entry. Please try again.",
      callback: data => {
        navigate(`/journal/edit/${data.data.id}`)
      },
      finalCallback: () => {
        setLoading(false)
      }
    })
  }

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
          <Button
            onClick={() => {
              createEntry().catch(console.error)
            }}
            icon={loading ? 'svg-spinners:180-ring' : 'tabler:plus'}
            className="mt-2 hidden shrink-0 sm:mt-6 md:flex"
          >
            New entry
          </Button>
        </div>
        <APIComponentWithFallback data={entries}>
          {typeof entries !== 'string' && entries.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-6 pb-8">
              {entries.map(entry => (
                <Link
                  to={`/journal/view/${entry.id}`}
                  key={entry.id}
                  className="rounded-lg bg-bg-100 p-6 shadow-custom hover:bg-bg-200/50 dark:bg-bg-900 dark:hover:bg-bg-800/70"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-semibold text-custom-500">
                      {entry.title}
                    </div>
                    <HamburgerMenu className="relative">
                      <MenuItem
                        icon="tabler:edit"
                        onClick={() => {
                          navigate(`/journal/edit/${entry.id}`)
                        }}
                        text="Edit entry"
                      />
                      <MenuItem
                        icon="tabler:trash"
                        onClick={() => {
                          setExistedData(entry)
                          setIsDeleteEntryConfirmModalOpen(true)
                        }}
                        text="Delete entry"
                        isRed
                      />
                    </HamburgerMenu>
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
                setModifyModalOpenType={() => {
                  createEntry().catch(console.error)
                }}
              />
            </div>
          )}
        </APIComponentWithFallback>
      </div>
      <DeleteConfirmationModal
        apiEndpoint="journal/entry/delete"
        data={existedData}
        isOpen={isDeleteEntryConfirmModalOpen}
        itemName="entry"
        onClose={() => {
          setIsDeleteEntryConfirmModalOpen(false)
          setExistedData(null)
        }}
        updateDataList={refreshEntries}
        nameKey="title"
      />
      {entries.length > 0 && (
        <FAB
          onClick={() => {
            createEntry().catch(console.error)
          }}
        />
      )}
    </ModuleWrapper>
  )
}

export default Journal
