import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Button } from '@components/buttons'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import DeleteConfirmationModal from '@components/modals/DeleteConfirmationModal'
import OTPScreen from '@components/screens/OTPScreen'
import { type Loadable } from '@interfaces/common'
import { type IJournalEntry } from '@interfaces/journal_interfaces'
import { useAuthContext } from '@providers/AuthProvider'
import { encrypt } from '@utils/encryption'
import fetchAPI from '@utils/fetchAPI'
import JournalList from './components/JournalList'
import JournalViewModal from './components/JournalViewModal'
import ModifyJournalEntryModal from './components/ModifyEntryModal'
import CreatePasswordScreen from '../../components/screens/CreatePasswordScreen'
import LockedScreen from '../../components/screens/LockedScreen'

function Journal(): React.ReactElement {
  const { t } = useTranslation('modules.journal')
  const { userData } = useAuthContext()
  const [masterPassword, setMasterPassword] = useState<string>('')
  const [entries, setEntries] = useState<Loadable<IJournalEntry[]>>('loading')
  const [journalViewModalOpen, setJournalViewModalOpen] = useState(false)
  const [
    deleteJournalConfirmationModalOpen,
    setDeleteJournalConfirmationModalOpen
  ] = useState(false)
  const [currentViewingJournal, setCurrentViewingJournal] = useState<
    string | null
  >(null)
  const [modifyEntryModalOpenType, setModifyEntryModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [existedData, setExistedData] = useState<IJournalEntry | null>(null)
  const [otpSuccess, setOtpSuccess] = useState(false)

  async function fetchData(): Promise<void> {
    setEntries('loading')

    try {
      const challenge = await fetchAPI<string>(`journal/auth/challenge`)

      const data = await fetchAPI<IJournalEntry[]>(
        `journal/entries/list?master=${encodeURIComponent(
          encrypt(masterPassword, challenge)
        )}`
      )

      setEntries(data)
    } catch {
      toast.error(t('fetch.fetchError'))
      setEntries('error')
    }
  }

  const renderContent = () => {
    if (!otpSuccess) {
      return (
        <OTPScreen
          callback={() => {
            setOtpSuccess(true)
          }}
          endpoint="journal/auth"
        />
      )
    }

    if (userData?.hasJournalMasterPassword === false) {
      return (
        <CreatePasswordScreen
          endpoint="journal/auth"
          keyInUserData="hasJournalMasterPassword"
        />
      )
    }

    if (masterPassword === '') {
      return (
        <LockedScreen
          endpoint="journal/auth"
          setMasterPassword={setMasterPassword}
        />
      )
    }

    return (
      <>
        <JournalList
          entries={entries}
          fetchData={fetchData}
          masterPassword={masterPassword}
          setCurrentViewingJournal={setCurrentViewingJournal}
          setDeleteJournalConfirmationModalOpen={
            setDeleteJournalConfirmationModalOpen
          }
          setExistedData={setExistedData}
          setJournalViewModalOpen={setJournalViewModalOpen}
          setModifyEntryModalOpenType={setModifyEntryModalOpenType}
        />
        <JournalViewModal
          id={currentViewingJournal}
          isOpen={journalViewModalOpen}
          masterPassword={masterPassword}
          onClose={() => {
            setJournalViewModalOpen(false)
            setCurrentViewingJournal(null)
          }}
        />
        <ModifyJournalEntryModal
          existedData={existedData}
          masterPassword={masterPassword}
          openType={modifyEntryModalOpenType}
          onClose={() => {
            setModifyEntryModalOpenType(null)
            setExistedData(null)
            fetchData().catch(console.error)
          }}
        />
        <DeleteConfirmationModal
          apiEndpoint="journal/entries/delete"
          data={existedData}
          isOpen={deleteJournalConfirmationModalOpen}
          itemName="journal entry"
          updateDataList={() => {
            setExistedData(null)
            fetchData().catch(console.error)
          }}
          onClose={() => {
            setDeleteJournalConfirmationModalOpen(false)
          }}
        />
      </>
    )
  }

  return (
    <ModuleWrapper>
      <div className="flex-between flex">
        <ModuleHeader icon="tabler:book" title="Journal" />
        {masterPassword !== '' && (
          <Button
            className="hidden lg:flex"
            icon="tabler:plus"
            onClick={() => {
              setExistedData(null)
              setModifyEntryModalOpenType('create')
            }}
          >
            new entry
          </Button>
        )}
      </div>
      {renderContent()}
    </ModuleWrapper>
  )
}

export default Journal
