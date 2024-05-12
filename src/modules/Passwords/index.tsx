/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable multiline-ternary */
import { Icon } from '@iconify/react'
import { cookieParse } from 'pocketbase'
import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import APIComponentWithFallback from '@components/APIComponentWithFallback'
import EmptyStateScreen from '@components/EmptyStateScreen'
import Input from '@components/Input'
import ModuleHeader from '@components/ModuleHeader'
import ModuleWrapper from '@components/ModuleWrapper'
import useFetch from '@hooks/useFetch'
import { AuthContext } from '@providers/AuthProvider'
import CreatePassword from './CreatePassword'
import CreatePasswordModal from './CreatePasswordModal'
import PasswordEntryITem from './PasswordEntryItem'

function Passwords(): React.ReactElement {
  const { userData } = useContext(AuthContext)
  const [masterPassWordInputContent, setMasterPassWordInputContent] =
    useState<string>('')
  const [masterPassword, setMasterPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [createPasswordModalOpen, setCreatePasswordModalOpen] =
    useState<boolean>(false)
  const [passwordList, refreshPasswordList] = useFetch<IPasswordEntry[]>(
    'passwords/password/list',
    masterPassword !== ''
  )

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
          <button
            onClick={() => {
              setCreatePasswordModalOpen(true)
            }}
            className="flex w-full  flex-center gap-2 whitespace-nowrap rounded-lg bg-custom-500 py-4 pl-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] transition-all hover:bg-custom-600 disabled:bg-bg-500 dark:text-bg-800 sm:w-auto"
          >
            <Icon icon="tabler:plus" className="text-xl" />
            new password
          </button>
        )}
      </div>
      {userData?.hasMasterPasswordHash === true ? (
        <CreatePassword />
      ) : masterPassword === '' ? (
        <div className="flex h-full w-full flex-1 flex-col flex-center gap-4">
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
          <button
            onClick={onSubmit}
            className="flex w-full flex-center gap-2 whitespace-nowrap rounded-lg bg-custom-500 py-4 pl-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] transition-all hover:bg-custom-600 disabled:bg-bg-500 dark:text-bg-800 sm:w-1/2"
          >
            {loading ? (
              <Icon icon="svg-spinners:180-ring" className="h-6 w-6" />
            ) : (
              <>
                <Icon icon="tabler:lock" className="text-xl" />
                Unlock
              </>
            )}
          </button>
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
                setCreatePasswordModalOpen(true)
              }}
            />
          )}
        </APIComponentWithFallback>
      )}
      <CreatePasswordModal
        isOpen={createPasswordModalOpen}
        onClose={() => {
          setCreatePasswordModalOpen(false)
        }}
        refreshPasswordList={refreshPasswordList}
        masterPassword={masterPassword}
      />
    </ModuleWrapper>
  )
}

export default Passwords
