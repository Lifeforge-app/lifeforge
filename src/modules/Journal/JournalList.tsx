import moment from 'moment'
import { cookieParse } from 'pocketbase'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import { type IJournalEntry } from '@interfaces/journal_interfaces'
import { encrypt } from '@utils/encryption'
import APIRequest from '@utils/fetchData'

function JournalList({
  setCurrentViewingJournal,
  setJournalViewModalOpen,
  masterPassword,
  setModifyEntryModalOpenType,
  setDeleteJournalConfirmationModalOpen,
  setExistedData,
  fetchData,
  entries
}: {
  setCurrentViewingJournal: React.Dispatch<React.SetStateAction<string | null>>
  setJournalViewModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setDeleteJournalConfirmationModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
  masterPassword: string
  setModifyEntryModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedData: React.Dispatch<React.SetStateAction<IJournalEntry | null>>
  fetchData: () => Promise<void>
  entries: IJournalEntry[] | 'loading' | 'error'
}): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState('')
  const [editLoading, setEditLoading] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    if (masterPassword !== '') {
      fetchData().catch(console.error)
    }
  }, [masterPassword])

  async function updateEntry(id: string): Promise<void> {
    setEditLoading(true)

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
      endpoint: `journal/entry/get/${id}?master=${encodeURIComponent(
        encrypt(masterPassword, challenge)
      )}`,
      method: 'GET',
      callback(data) {
        setExistedData(data.data)
        setModifyEntryModalOpenType('update')
      },
      onFailure: () => {
        toast.error(t('fetch.fetchError'))
      },
      finalCallback: () => {
        setEditLoading(false)
      }
    })
  }

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
                    }}
                    className="w-full rounded-lg bg-bg-100 p-6 text-left shadow-custom hover:bg-bg-200/50 dark:bg-bg-900 dark:hover:bg-bg-800/70"
                  >
                    <div className="flex-between flex">
                      <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-bg-500">
                          {moment(entry.date).format('MMMM Do, YYYY')}
                        </span>
                        <h2 className="text-2xl font-semibold">
                          {entry.title === '' ? 'Untitled' : entry.title}
                        </h2>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="block rounded-full bg-bg-700/50 px-3 py-1 text-base font-medium">
                          {entry.mood.emoji} {entry.mood.text}
                        </span>
                        <HamburgerMenu className="relative">
                          <MenuItem
                            onClick={() => {
                              updateEntry(entry.id).catch(console.error)
                            }}
                            icon={
                              editLoading
                                ? 'svg-spinners:180-ring'
                                : 'tabler:pencil'
                            }
                            text="Edit"
                            disabled={editLoading}
                          />
                          <MenuItem
                            onClick={() => {
                              setDeleteJournalConfirmationModalOpen(true)
                              setExistedData(entry)
                            }}
                            isRed
                            text="Delete"
                            icon="tabler:trash"
                          />
                        </HamburgerMenu>
                      </div>
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
                  onCTAClick={() => {
                    setModifyEntryModalOpenType('create')
                    setExistedData(null)
                  }}
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
