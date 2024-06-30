import moment from 'moment'
import { cookieParse } from 'pocketbase'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import { type IJournalEntry } from '@interfaces/journal_interfaces'
import { encrypt } from '@utils/encryption'
import APIRequest from '@utils/fetchData'

function JournalList({
  setCurrentViewingJournal,
  setJournalViewModalOpen,
  masterPassword
}: {
  setCurrentViewingJournal: React.Dispatch<React.SetStateAction<string | null>>
  setJournalViewModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  masterPassword: string
}): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState('')
  const [entries, setEntries] = useState<IJournalEntry[] | 'loading' | 'error'>(
    'loading'
  )
  const { t } = useTranslation()

  useEffect(() => {
    async function fetchData(): Promise<void> {
      const challenge = await fetch(
        `${import.meta.env.VITE_API_HOST}/journal/auth/challenge`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${cookieParse(document.cookie).token}`
          }
        }
      ).then(async res => {
        const data = await res.json()
        if (res.ok && data.state === 'success') {
          return data.data
        } else {
          throw new Error(t('fetch.fetchError'))
        }
      })

      await APIRequest({
        endpoint: `journal/entry/list?master=${encodeURIComponent(
          encrypt(masterPassword, challenge)
        )}`,
        method: 'GET',
        callback: data => {
          setEntries(data.data)
        },
        onFailure: () => {
          toast.error(t('fetch.fetchError'))
          setEntries('error')
        }
      })
    }

    if (masterPassword !== '') {
      fetchData().catch(console.error)
    }
  }, [masterPassword])

  return (
    <>
      <div className="mt-6 flex min-h-0 w-full flex-1 flex-col">
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          stuffToSearch="daily journal entries"
        />
        <APIComponentWithFallback data={entries}>
          {entries =>
            entries.length > 0 ? (
              <div className="mt-6 grid grid-cols-1 gap-6 pb-8">
                {entries.map(entry => (
                  <button
                    key={entry.id}
                    onClick={() => {
                      setCurrentViewingJournal(entry.id)
                      setJournalViewModalOpen(true)
                    }}24w2
                    className="w-full rounded-lg bg-bg-100 p-6 text-left shadow-custom hover:bg-bg-200/50 dark:bg-bg-900 dark:hover:bg-bg-800/70"
                  >
                    <div className="flex-between flex">
                      <div className="text-xl font-semibold">
                        {moment(entry.date).format('MMMM Do, YYYY')}
                      </div>
                      <span className="block rounded-full bg-bg-700/50 px-3 py-1 text-base font-medium">
                        {entry.mood.emoji} {entry.mood.text}
                      </span>
                    </div>
                    <div className="mt-4 text-bg-500">{entry.content}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-6">
                <EmptyStateScreen
                  title="No entries found"
                  description="You haven't written any journal entries yet."
                  icon="tabler:book-off"
                  ctaContent="new entry"
                  onCTAClick={() => {}}
                />
              </div>
            )
          }
        </APIComponentWithFallback>
      </div>
    </>
  )
}

export default JournalList
