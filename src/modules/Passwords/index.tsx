/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { useDebounce } from '@uidotdev/usehooks'
import { cookieParse } from 'pocketbase'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@components/ButtonsAndInputs/Button'
import FAB from '@components/ButtonsAndInputs/FAB'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import CreatePasswordScreen from '@components/Screens/CreatePasswordScreen'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import OTPScreen from '@components/Screens/OTPScreen'
import useFetch from '@hooks/useFetch'
import { type IPasswordEntry } from '@interfaces/password_interfaces'
import { useAuthContext } from '@providers/AuthProvider'
import CreatePasswordModal from './components/CreatePasswordModal'
import PasswordEntryITem from './components/PasswordEntryItem'
import LockedScreen from '../../components/Screens/LockedScreen'

function Passwords(): React.ReactElement {
  const { t } = useTranslation()
  const { userData } = useAuthContext()
  const [otpSuccess, setOtpSuccess] = useState(false)
  const [masterPassword, setMasterPassword] = useState<string>('')
  const [createPasswordModalOpenType, setCreatePasswordModalOpenType] =
    useState<'create' | 'update' | null>(null)
  const [query, setQuery] = useState<string>('')
  const debouncedQuery = useDebounce(query, 500)
  const [passwordList, refreshPasswordList, setPasswordList] = useFetch<
    IPasswordEntry[]
  >('passwords/password', masterPassword !== '')
  const filteredPasswordList = useMemo(() => {
    if (debouncedQuery === '' || typeof passwordList === 'string') {
      return passwordList
    }

    return passwordList.filter(
      password =>
        password.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        password.website.toLowerCase().includes(debouncedQuery.toLowerCase())
    )
  }, [debouncedQuery, passwordList])

  const [selectedPassword, setSelectedPassword] =
    useState<IPasswordEntry | null>(null)
  const [
    isDeletePasswordConfirmationModalOpen,
    setIsDeletePasswordConfirmationModalOpen
  ] = useState(false)
  const [existedData, setExistedData] = useState<IPasswordEntry | null>(null)

  async function fetchChallenge(): Promise<string> {
    return await fetch(
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
  }

  return (
    <ModuleWrapper>
      <div className="flex-between flex">
        <ModuleHeader
          icon="tabler:key"
          title="Passwords"
          desc="A vault to store your passwords securely."
        />
        {otpSuccess && masterPassword !== '' && (
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
      {otpSuccess ? (
        <>
          {masterPassword !== '' && (
            <SearchInput
              searchQuery={query}
              setSearchQuery={setQuery}
              stuffToSearch="passwords"
            />
          )}
          {userData?.hasMasterPassword === false ? (
            <CreatePasswordScreen
              endpoint="passwords/master"
              keyInUserData="hasMasterPassword"
            />
          ) : masterPassword === '' ? (
            <LockedScreen
              module="vault"
              endpoint="passwords/master/verify"
              setMasterPassword={setMasterPassword}
              fetchChallenge={fetchChallenge}
            />
          ) : (
            <APIComponentWithFallback data={passwordList}>
              {() =>
                typeof filteredPasswordList !== 'string' ? (
                  filteredPasswordList.length > 0 ? (
                    <div className="my-8 flex w-full flex-col gap-4">
                      {filteredPasswordList.map(password => (
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
                      onCTAClick={() => {
                        setSelectedPassword(null)
                        setCreatePasswordModalOpenType('create')
                      }}
                    />
                  )
                ) : (
                  <></>
                )
              }
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
        </>
      ) : (
        <OTPScreen
          verificationEndpoint="passwords/master/otp"
          callback={() => {
            setOtpSuccess(true)
          }}
          fetchChallenge={fetchChallenge}
        />
      )}
    </ModuleWrapper>
  )
}

export default Passwords
