import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import Button from '@components/ButtonsAndInputs/Button'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import OTPScreen from '@components/Screens/OTPScreen'
import { type IJournalEntry } from '@interfaces/journal_interfaces'
import { useAuthContext } from '@providers/AuthProvider'
import { encrypt } from '@utils/encryption'
import APIRequest from '@utils/fetchData'
import JournalList from './components/JournalList'
import JournalViewModal from './components/JournalViewModal'
import ModifyJournalEntryModal from './components/ModifyEntryModal'
import { fetchChallenge } from './utils/fetchChallenge'
import CreatePasswordScreen from '../../components/Screens/CreatePasswordScreen'
import LockedScreen from '../../components/Screens/LockedScreen'

function Journal(): React.ReactElement {
  const { t } = useTranslation()
  const { userData } = useAuthContext()
  const [masterPassword, setMasterPassword] = useState<string>('')
  const [entries, setEntries] = useState<IJournalEntry[] | 'loading' | 'error'>(
    'loading'
  )
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

    const challenge = await fetchChallenge()

    await APIRequest({
      endpoint: `journal/entries/list?master=${encodeURIComponent(
        encrypt(masterPassword, challenge)
      )}`,
      method: 'GET',
      callback(data) {
        setEntries(data.data)
      },
      onFailure: () => {
        toast.error(t('fetch.fetchError'))
        setEntries('error')
      }
    })
  }

  return (
    <ModuleWrapper>
      <div className="flex-between flex">
        <ModuleHeader icon="tabler:book" title="Journal" desc="..." />
        {masterPassword !== '' && (
          <Button
            onClick={() => {
              setExistedData(null)
              setModifyEntryModalOpenType('create')
            }}
            icon="tabler:plus"
            className="hidden lg:flex "
          >
            new entry
          </Button>
        )}
      </div>
      {otpSuccess ? (
        userData?.hasJournalMasterPassword === false ? (
          <CreatePasswordScreen
            endpoint="journal/auth"
            keyInUserData="hasJournalMasterPassword"
          />
        ) : masterPassword === '' ? (
          <LockedScreen
            module="journal"
            endpoint="journal/auth/verify"
            setMasterPassword={setMasterPassword}
            fetchChallenge={fetchChallenge}
          />
        ) : (
          <>
            <JournalList
              setJournalViewModalOpen={setJournalViewModalOpen}
              setCurrentViewingJournal={setCurrentViewingJournal}
              masterPassword={masterPassword}
              setModifyEntryModalOpenType={setModifyEntryModalOpenType}
              setDeleteJournalConfirmationModalOpen={
                setDeleteJournalConfirmationModalOpen
              }
              setExistedData={setExistedData}
              fetchData={fetchData}
              entries={entries}
            />
            <JournalViewModal
              id={currentViewingJournal}
              isOpen={journalViewModalOpen}
              onClose={() => {
                setJournalViewModalOpen(false)
                setCurrentViewingJournal(null)
              }}
              masterPassword={masterPassword}
            />
            <ModifyJournalEntryModal
              openType={modifyEntryModalOpenType}
              onClose={() => {
                setModifyEntryModalOpenType(null)
                setExistedData(null)
                fetchData().catch(console.error)
              }}
              existedData={existedData}
              masterPassword={masterPassword}
            />
            <DeleteConfirmationModal
              apiEndpoint="journal/entries/delete"
              data={existedData}
              isOpen={deleteJournalConfirmationModalOpen}
              onClose={() => {
                setDeleteJournalConfirmationModalOpen(false)
              }}
              itemName="journal entry"
              updateDataList={() => {
                setExistedData(null)
                fetchData().catch(console.error)
              }}
            />
          </>
        )
      ) : (
        <OTPScreen
          verificationEndpoint="journal/auth/otp"
          callback={() => {
            setOtpSuccess(true)
          }}
          fetchChallenge={fetchChallenge}
        />
      )}
    </ModuleWrapper>
  )
}

export default Journal
