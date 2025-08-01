import { useQueryClient } from '@tanstack/react-query'
import { EmptyStateScreen, QueryWrapper } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { fetchAPI } from 'shared'

import {
  type PasswordEntry,
  usePasswordContext
} from '@apps/Passwords/providers/PasswordsProvider'

import PasswordEntryItem from './PasswordEntryItem'

function PasswordList() {
  const queryClient = useQueryClient()

  const { t } = useTranslation('apps.passwords')

  const { passwordListQuery, filteredPasswordList } = usePasswordContext()

  async function pinPassword(id: string) {
    const mapPasswords = (p: PasswordEntry) =>
      p.id === id ? { ...p, pinned: !p.pinned } : p

    const sortPasswords = (a: PasswordEntry, b: PasswordEntry) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1

      return 0
    }

    try {
      await fetchAPI(
        import.meta.env.VITE_API_HOST,
        `passwords/entries/pin/${id}`,
        {
          method: 'POST'
        }
      )

      queryClient.setQueryData<PasswordEntry[]>(
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
          <div className="my-8 flex w-full flex-col gap-3">
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
