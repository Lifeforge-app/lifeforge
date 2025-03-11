import { usePasswordContext } from '@providers/PasswordsProvider'
import fetchAPI from '@utils/fetchAPI'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { APIFallbackComponent, EmptyStateScreen } from '@lifeforge/ui'

import { IPasswordEntry } from '@interfaces/password_interfaces'

import PasswordEntryItem from './PasswordEntryItem'

function PasswordList(): React.ReactElement {
  const { t } = useTranslation('modules.passwords')
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

    try {
      await fetchAPI(`passwords/password/pin/${id}`, {
        method: 'POST'
      })

      setPasswordList(prev => {
        if (prev === 'loading' || prev === 'error') return prev

        return prev.map(mapPasswords).sort(sortPasswords)
      })
    } catch {
      toast.error(t('error.pin'))
      setPasswordList('error')
    }
  }

  return (
    <APIFallbackComponent data={filteredPasswordList}>
      {filteredPasswordList =>
        filteredPasswordList.length === 0 ? (
          <EmptyStateScreen
            ctaContent="new"
            ctaTProps={{ item: t('items.password') }}
            icon="tabler:key-off"
            name="password"
            namespace="modules.passwords"
            onCTAClick={() => {
              setModifyPasswordModalOpenType('create')
              setExistedData(null)
            }}
          />
        ) : (
          <div className="my-8 flex w-full flex-col gap-4">
            {filteredPasswordList.map(password => (
              <PasswordEntryItem
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
