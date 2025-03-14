import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import {
  APIFallbackComponent,
  EmptyStateScreen,
  SearchInput
} from '@lifeforge/ui'

import { type Loadable } from '@interfaces/common'

import fetchAPI from '@utils/fetchAPI'

import { encrypt } from '../../../../core/security/utils/encryption'
import { type IJournalEntry } from '../../interfaces/journal_interfaces'
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
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [editLoading, setEditLoading] = useState(false)
  const { t } = useTranslation('modules.journal')

  useEffect(() => {
    if (masterPassword !== '') {
      fetchData().catch(console.error)
    }
  }, [masterPassword])

  async function updateEntry(id: string) {
    setEditLoading(true)

    try {
      const challenge = await fetchAPI<string>(`journal/auth/challenge`)

      const data = await fetchAPI<IJournalEntry>(
        `journal/entries/get/${id}?master=${encodeURIComponent(
          encrypt(masterPassword, challenge)
        )}`
      )

      setExistedData(data)
      setModifyEntryModalOpenType('update')
    } catch {
      toast.error(t('fetch.fetchError'))
    } finally {
      setEditLoading(false)
    }
  }

  return (
    <>
      <div className="mb-8 mt-6 flex min-h-0 w-full flex-1 flex-col">
        <SearchInput
          namespace="modules.journal"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          stuffToSearch="entry"
        />
        <APIFallbackComponent data={entries}>
          {entries =>
            entries.length > 0 ? (
              <div className="mt-6 flex flex-col gap-4 pb-8">
                {entries.map(entry => (
                  <JournalListItem
                    key={entry.id}
                    editLoading={editLoading}
                    entry={entry}
                    setCurrentViewingJournal={setCurrentViewingJournal}
                    setDeleteJournalConfirmationModalOpen={
                      setDeleteJournalConfirmationModalOpen
                    }
                    setExistedData={setExistedData}
                    setJournalViewModalOpen={setJournalViewModalOpen}
                    updateEntry={updateEntry}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-6 flex-1">
                <EmptyStateScreen
                  ctaContent="new"
                  ctaTProps={{
                    item: t('items.entry')
                  }}
                  icon="tabler:book-off"
                  name="entry"
                  namespace="modules.journal"
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
