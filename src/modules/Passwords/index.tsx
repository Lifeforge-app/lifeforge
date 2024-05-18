/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Icon } from '@iconify/react'
import { cookieParse } from 'pocketbase'
import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import APIComponentWithFallback from '@components/APIComponentWithFallback'
import Button from '@components/Button'
import DeleteConfirmationModal from '@components/DeleteConfirmationModal'
import EmptyStateScreen from '@components/EmptyStateScreen'
import Input from '@components/Input'
import ModuleHeader from '@components/ModuleHeader'
import ModuleWrapper from '@components/ModuleWrapper'
import useFetch from '@hooks/useFetch'
import { AuthContext } from '@providers/AuthProvider'
import { type IPasswordEntry } from '@typedec/Password'
import CreatePassword from './CreatePassword'
import CreatePasswordModal from './CreatePasswordModal'
import PasswordEntryITem from './PasswordEntryItem'

function Passwords(): React.ReactElement {
  const { userData } = useContext(AuthContext)
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

  function onSubmit(): void {
    if (masterPassWordInputContent.trim() === '') {
      toast.error('Please fill in the field')
      return
    }

    setLoading(true)

    fetch(`${import.meta.env.VITE_API_HOST}/passwords/master/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookieParse(document.cookie).token}`
      },
      body: JSON.stringify({
        password: masterPassWordInputContent,
        id: userData.id
      })
    })
      .then(async res => {
        const data = await res.json()
        if (res.ok && data.data === true) {
          setMasterPassword(masterPassWordInputContent)
          setMasterPassWordInputContent('')
          toast.success('Vault unlocked')
        } else {
          throw new Error(data.message)
        }
      })
      .catch(err => {
        toast.error('Incorrect password')
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
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
            additionalClassName="w-1/2"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                onSubmit()
              }
            }}
            darker
          />
          <Button
            onClick={onSubmit}
            disabled={loading}
            className="w-1/2"
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
              ctaContent="add password"
              setModifyModalOpenType={() => {
                setCreatePasswordModalOpenType('create')
              }}
            />
          )}
        </APIComponentWithFallback>
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
