import React from 'react'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import { IPasswordEntry } from '@interfaces/password_interfaces'
import { usePasswordContext } from '@providers/PasswordsProvider'
import APIRequest from '@utils/fetchData'
import PasswordEntryITem from './PasswordEntryItem'

function PasswordList(): React.ReactElement {
  const {
    setModifyPasswordModalOpenType,
    setExistedData,
    filteredPasswordList,
    setPasswordList
  } = usePasswordContext()

  async function pinPassword(id: string): Promise<void> {
    const mapPasswords = (p: IPasswordEntry) =>
      p.id === id ? { ...p, pinned: !p.pinned } : p
    const sortPasswords = (a: IPasswordEntry, b: IPasswordEntry) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return 0
    }

    const callback = () =>
      setPasswordList(prev => {
        if (prev === 'loading' || prev === 'error') return prev

        return prev.map(mapPasswords).sort(sortPasswords)
      })

    await APIRequest({
      endpoint: `passwords/password/pin/${id}`,
      method: 'POST',
      successInfo: 'pin',
      failureInfo: 'pin',
      callback
    })
  }

  return (
    <APIFallbackComponent data={filteredPasswordList}>
      {filteredPasswordList =>
        filteredPasswordList.length === 0 ? (
          <EmptyStateScreen
            description="No passwords are found in your vault yet."
            title="Hmm... Seems a bit empty here."
            icon="tabler:key-off"
            ctaContent="new password"
            onCTAClick={() => {
              setModifyPasswordModalOpenType('create')
              setExistedData(null)
            }}
          />
        ) : (
          <div className="my-8 flex w-full flex-col gap-4">
            {filteredPasswordList.map(password => (
              <PasswordEntryITem
                key={password.id}
                password={password}
                pinPassword={pinPassword}
              />
            ))}
          </div>
        )
      }
    </APIFallbackComponent>
  )
}

export default PasswordList
