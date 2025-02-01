import { cookieParse } from 'pocketbase'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { SearchInput } from '@components/inputs'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import { type Loadable } from '@interfaces/common'
import { type IJournalEntry } from '@interfaces/journal_interfaces'
import { encrypt } from '@utils/encryption'
import APIRequest from '@utils/fetchData'
import JournalListItem from './components/JournalListItem'

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
  entries: Loadable<IJournalEntry[]>
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
      endpoint: `journal/entries/get/${id}?master=${encodeURIComponent(
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
      <div className="mb-8 mt-6 flex min-h-0 w-full flex-1 flex-col">
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          stuffToSearch="entry"
          namespace="modules.journal"
        />
        <APIFallbackComponent data={entries}>
          {entries =>
            entries.length > 0 ? (
              <div className="mt-6 flex flex-col gap-4 pb-8">
                {entries.map(entry => (
                  <JournalListItem
                    key={entry.id}
                    entry={entry}
                    editLoading={editLoading}
                    updateEntry={updateEntry}
                    setCurrentViewingJournal={setCurrentViewingJournal}
                    setJournalViewModalOpen={setJournalViewModalOpen}
                    setDeleteJournalConfirmationModalOpen={
                      setDeleteJournalConfirmationModalOpen
                    }
                    setExistedData={setExistedData}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-6 flex-1">
                <EmptyStateScreen
                  icon="tabler:book-off"
                  namespace="modules.journal"
                  name="entry"
                  ctaContent="new"
                  ctaTProps={{
                    item: t('items.entry')
                  }}
                  onCTAClick={() => {
                    setModifyEntryModalOpenType('create')
                    setExistedData(null)
                  }}
                />
              </div>
            )
          }
        </APIFallbackComponent>
      </div>
    </>
  )
}

export default JournalList
