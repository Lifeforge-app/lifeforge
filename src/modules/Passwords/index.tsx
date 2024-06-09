/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Icon } from '@iconify/react'
import { cookieParse } from 'pocketbase'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@components/ButtonsAndInputs/Button'
import Input from '@components/ButtonsAndInputs/Input'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import useFetch from '@hooks/useFetch'
import { useAuthContext } from '@providers/AuthProvider'
import { type IPasswordEntry } from '@typedec/Password'
import { encrypt } from '@utils/encryption'
import APIRequest from '@utils/fetchData'
import CreatePassword from './CreatePassword'
import CreatePasswordModal from './CreatePasswordModal'
import PasswordEntryITem from './PasswordEntryItem'

function Passwords(): React.ReactElement {
  const { userData } = useAuthContext()
  const [masterPassWordInputContent, setMasterPassWordInputContent] =
    useState<string>('')
  const [masterPassword, setMasterPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [createPasswordModalOpenType, setCreatePasswordModalOpenType] =
    useState<'create' | 'update' | null>(null)
  const [passwordList, refreshPasswordList, setPasswordList] = useFetch<
    IPasswordEntry[]
  >('passwords/password/list', masterPassword !== '')
  const [selectedPassword, setSelectedPassword] =
    useState<IPasswordEntry | null>(null)
  const [
    isDeletePasswordConfirmationModalOpen,
    setIsDeletePasswordConfirmationModalOpen
  ] = useState<boolean>(false)
  const [existedData, setExistedData] = useState<IPasswordEntry | null>(null)

  async function onSubmit(): Promise<void> {
    if (masterPassWordInputContent.trim() === '') {
      toast.error('Please fill in the field')
      return
    }

    setLoading(true)

    const challenge = await fetch(
      `${import.meta.env.VITE_API_HOST}/passwords/master/challenge`,
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
        throw new Error('Failed to get challenge')
      }
    })

    await APIRequest({
      endpoint: 'passwords/master/verify',
      method: 'POST',
      body: {
        password: encrypt(masterPassWordInputContent, challenge),
        id: userData.id
      },
      callback: data => {
        if (data.data === true) {
          toast.info('Vault unlocked')
          setMasterPassword(masterPassWordInputContent)
          setMasterPassWordInputContent('')
        } else {
          toast.error('Incorrect password')
        }
      },
      finalCallback: () => {
        setLoading(false)
      }
    })
  }

  return (
    <ModuleWrapper>
      <div className="flex items-center justify-between">
        <ModuleHeader
          title="Passwords"
          desc="A vault to store your passwords securely."
        />
        {masterPassword !== '' && (
          <Button
            onClick={() => {
              setCreatePasswordModalOpenType('create')
            }}
            icon="tabler:plus"
            className="hidden lg:flex "
          >
            new password
          </Button>
        )}
      </div>
      {userData?.hasMasterPassword === false ? (
        <CreatePassword />
      ) : masterPassword === '' ? (
        <div className="flex-center flex h-full w-full flex-1 flex-col gap-4">
          <Icon icon="tabler:lock-access" className="h-28 w-28" />
          <h2 className="text-4xl font-semibold">Your vault is locked</h2>
          <p className="mb-8 text-center text-lg text-bg-500">
            A master password is required to decrypt your passwords.
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
            disabled={loading}
            className="w-full md:w-3/4 xl:w-1/2"
            icon={loading ? 'svg-spinners:180-ring' : 'tabler:lock'}
          >
            Unlock
          </Button>
        </div>
      ) : (
        <APIComponentWithFallback data={passwordList}>
          {typeof passwordList !== 'string' && passwordList.length > 0 ? (
            <div className="mb-12 mt-8 flex w-full flex-col gap-4">
              {passwordList.map(password => (
                <PasswordEntryITem
                  key={password.id}
                  password={password}
                  masterPassword={masterPassword}
                  setSelectedPassword={setSelectedPassword}
                  setIsDeletePasswordConfirmationModalOpen={
                    setIsDeletePasswordConfirmationModalOpen
                  }
                  setCreatePasswordModalOpenType={
                    setCreatePasswordModalOpenType
                  }
                  setExistedData={setExistedData}
                  setPasswordList={setPasswordList}
                />
              ))}
            </div>
          ) : (
            <EmptyStateScreen
              description="No passwords are found in your vault yet."
              title="Hmm... Seems a bit empty here."
              icon="tabler:key-off"
              ctaContent="new password"
              setModifyModalOpenType={() => {
                setSelectedPassword(null)
                setCreatePasswordModalOpenType('create')
              }}
            />
          )}
        </APIComponentWithFallback>
      )}
      {masterPassword !== '' && passwordList.length > 0 && (
        <button
          onClick={() => {
            setSelectedPassword(null)
            setCreatePasswordModalOpenType('create')
          }}
          className="absolute bottom-6 right-6 z-10 flex items-center gap-2 rounded-lg bg-custom-500 p-4 font-semibold uppercase tracking-wider text-bg-100 shadow-lg hover:bg-custom-600 dark:text-bg-800 lg:hidden"
        >
          <Icon icon="tabler:plus" className="size-6 shrink-0 transition-all" />
        </button>
      )}
      <CreatePasswordModal
        openType={createPasswordModalOpenType}
        onClose={() => {
          setCreatePasswordModalOpenType(null)
        }}
        refreshPasswordList={refreshPasswordList}
        masterPassword={masterPassword}
        existedData={existedData}
      />
      <DeleteConfirmationModal
        apiEndpoint="passwords/password/delete"
        data={selectedPassword}
        isOpen={isDeletePasswordConfirmationModalOpen}
        itemName="password"
        onClose={() => {
          setIsDeletePasswordConfirmationModalOpen(false)
        }}
        updateDataList={refreshPasswordList}
        customText={`Are you sure you want to delete the password for ${selectedPassword?.name}? This action is irreversible.`}
      />
    </ModuleWrapper>
  )
}

export default Passwords
