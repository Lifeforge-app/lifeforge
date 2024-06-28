import { Icon } from '@iconify/react/dist/iconify.js'
import { cookieParse } from 'pocketbase'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import Button from '@components/ButtonsAndInputs/Button'
import Input from '@components/ButtonsAndInputs/Input'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import { useAuthContext } from '@providers/AuthProvider'
import { encrypt } from '@utils/encryption'
import APIRequest from '@utils/fetchData'
import CreatePassword from './CreatePassword'
import JournalList from './JournalList'
import JournalViewModal from './JournalViewModal'

function Journal(): React.ReactElement {
  const { t } = useTranslation()
  const { userData } = useAuthContext()
  const [masterPassWordInputContent, setMasterPassWordInputContent] =
    useState<string>('')
  const [masterPassword, setMasterPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [journalViewModalOpen, setJournalViewModalOpen] =
    useState<boolean>(false)
  const [currentViewingJournal, setCurrentViewingJournal] = useState<
    string | null
  >(null)

  async function onSubmit(): Promise<void> {
    if (masterPassWordInputContent.trim() === '') {
      toast.error('Please fill in the field')
      return
    }

    setLoading(true)

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
        toast.error(t('journal.failedToUnlock'))
        setLoading(false)

        throw new Error(t('journal.failedToUnlock'))
      }
    })

    await APIRequest({
      endpoint: 'journal/auth/verify',
      method: 'POST',
      body: {
        password: encrypt(masterPassWordInputContent, challenge),
        id: userData.id
      },
      callback: data => {
        if (data.data === true) {
          toast.info(t('vault.unlocked'))
          setMasterPassword(masterPassWordInputContent)
          setMasterPassWordInputContent('')
        } else {
          toast.error(t('journal.failedToUnlock'))
        }
      },
      finalCallback: () => {
        setLoading(false)
      },
      onFailure: () => {
        toast.error(t('journal.failedToUnlock'))
      }
    })
  }

  return (
    <ModuleWrapper>
      <div className="flex-between flex">
        <ModuleHeader title="Journal" desc="..." />
        {masterPassword !== '' && (
          <Button
            onClick={() => {}}
            icon="tabler:plus"
            className="hidden lg:flex "
          >
            new entry
          </Button>
        )}
      </div>
      {userData?.hasJournalMasterPassword === false ? (
        <CreatePassword />
      ) : masterPassword === '' ? (
        <div className="flex-center flex size-full flex-1 flex-col gap-4">
          <Icon icon="tabler:lock-access" className="size-28" />
          <h2 className="text-4xl font-semibold">
            {t('journal.lockedMessage')}
          </h2>
          <p className="mb-8 text-center text-lg text-bg-500">
            {t('journal.passwordRequired')}
          </p>
          <Input
            isPassword
            icon="tabler:lock"
            name="Master Password"
            placeholder="Enter your master password"
            value={masterPassWordInputContent}
            updateValue={e => {
              setMasterPassWordInputContent(e.target.value)
            }}
            noAutoComplete
            additionalClassName="w-full md:w-3/4 xl:w-1/2"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                onSubmit().catch(console.error)
              }
            }}
            darker
          />
          <Button
            onClick={() => {
              onSubmit().catch(console.error)
            }}
            loading={loading}
            className="w-full md:w-3/4 xl:w-1/2"
            icon="tabler:lock"
          >
            Unlock
          </Button>
        </div>
      ) : (
        <>
          <JournalList
            setJournalViewModalOpen={setJournalViewModalOpen}
            setCurrentViewingJournal={setCurrentViewingJournal}
            masterPassword={masterPassword}
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
        </>
      )}
    </ModuleWrapper>
  )
}

export default Journal
