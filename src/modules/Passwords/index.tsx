/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Icon } from '@iconify/react'
import { cookieParse } from 'pocketbase'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import Button from '@components/ButtonsAndInputs/Button'
import FAB from '@components/ButtonsAndInputs/FAB'
import Input from '@components/ButtonsAndInputs/Input'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import useFetch from '@hooks/useFetch'
import { type IPasswordEntry } from '@interfaces/password_interfaces'
import { useAuthContext } from '@providers/AuthProvider'
import { encrypt } from '@utils/encryption'
import APIRequest from '@utils/fetchData'
import CreatePassword from './CreatePassword'
import CreatePasswordModal from './CreatePasswordModal'
import PasswordEntryITem from './PasswordEntryItem'

function Passwords(): React.ReactElement {
  const { t } = useTranslation()
  const { userData } = useAuthContext()
  const [masterPassWordInputContent, setMasterPassWordInputContent] =
    useState<string>('')
  const [masterPassword, setMasterPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [createPasswordModalOpenType, setCreatePasswordModalOpenType] =
    useState<'create' | 'update' | null>(null)
  const [passwordList, refreshPasswordList, setPasswordList] = useFetch<
    IPasswordEntry[]
  >('passwords/password', masterPassword !== '')
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
        throw new Error(t('vault.failedToUnlock'))
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
          toast.info(t('vault.unlocked'))
          setMasterPassword(masterPassWordInputContent)
          setMasterPassWordInputContent('')
        } else {
          toast.error(t('vault.failedToUnlock'))
        }
      },
      finalCallback: () => {
        setLoading(false)
      },
      onFailure: () => {
        toast.error(t('vault.failedToUnlock'))
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
        <div className="flex-center flex size-full flex-1 flex-col gap-4">
          <Icon icon="tabler:lock-access" className="size-28" />
          <h2 className="text-4xl font-semibold">{t('vault.lockedMessage')}</h2>
          <p className="mb-8 text-center text-lg text-bg-500">
            {t('vault.passwordRequired')}
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
        <FAB
          onClick={() => {
            setSelectedPassword(null)
            setCreatePasswordModalOpenType('create')
          }}
          hideWhen="lg"
        />
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
        apiEndpoint="passwords/password"
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
