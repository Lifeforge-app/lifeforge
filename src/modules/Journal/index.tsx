import { useAuth } from '@providers/AuthProvider'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import {
  Button,
  DeleteConfirmationModal,
  ModuleHeader,
  ModuleWrapper
} from '@lifeforge/ui'

import CreatePasswordScreen from '@security/components/CreatePasswordScreen'
import LockedScreen from '@security/components/LockedScreen'
import OTPScreen from '@security/components/OTPScreen'

import { type Loadable } from '@interfaces/common'

import fetchAPI from '@utils/fetchAPI'

import { encrypt } from '../../core/security/utils/encryption'
import JournalList from './components/JournalList'
import JournalViewModal from './components/JournalViewModal'
import ModifyJournalEntryModal from './components/ModifyEntryModal'
import { type IJournalEntry } from './interfaces/journal_interfaces'

function Journal() {
  const { t } = useTranslation('modules.journal')
  const { userData } = useAuth()
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

  async function fetchData() {
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
      return <CreatePasswordScreen endpoint="journal/auth" />
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
