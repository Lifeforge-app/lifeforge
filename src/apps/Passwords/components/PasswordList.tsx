import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { EmptyStateScreen, QueryWrapper } from '@lifeforge/ui'

import { usePasswordContext } from '@apps/Passwords/providers/PasswordsProvider'

import fetchAPI from '@utils/fetchAPI'

import { IPasswordEntry } from '../interfaces/password_interfaces'
import PasswordEntryItem from './PasswordEntryItem'

function PasswordList() {
  const queryClient = useQueryClient()
  const { t } = useTranslation('apps.passwords')
  const { passwordListQuery, filteredPasswordList } = usePasswordContext()

  async function pinPassword(id: string) {
    const mapPasswords = (p: IPasswordEntry) =>
      p.id === id ? { ...p, pinned: !p.pinned } : p
    const sortPasswords = (a: IPasswordEntry, b: IPasswordEntry) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return 0
    }

    try {
      await fetchAPI(`passwords/entries/pin/${id}`, {
        method: 'POST'
      })

      queryClient.setQueryData<IPasswordEntry[]>(
        ['passwords', 'entries'],
        prev => {
          if (!prev) return prev

          return prev.map(mapPasswords).sort(sortPasswords)
        }
      )
    } catch {
      toast.error(t('error.pin'))
      queryClient.invalidateQueries({ queryKey: ['passwords', 'entries'] })
    }
  }

  return (
    <QueryWrapper query={passwordListQuery}>
      {() =>
        filteredPasswordList.length === 0 ? (
          <EmptyStateScreen
            ctaContent="new"
            ctaTProps={{ item: t('items.password') }}
            icon="tabler:key-off"
            name={passwordListQuery.data?.length ? 'search' : 'passwords'}
            namespace="apps.passwords"
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
    </QueryWrapper>
  )
}

export default PasswordList
