import { useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { EmptyStateScreen, WithQuery, useModalStore } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import {
  type PasswordEntry,
  usePasswordContext
} from '@apps/Passwords/providers/PasswordsProvider'

import ModifyPasswordModal from '../modals/ModifyPasswordModal'
import PasswordEntryItem from './PasswordEntryItem'

function PasswordList() {
  const queryClient = useQueryClient()

  const open = useModalStore(state => state.open)

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
      await forgeAPI.passwords.entries.togglePin.input({ id }).mutate({})

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
    <WithQuery query={passwordListQuery}>
      {() =>
        filteredPasswordList.length === 0 ? (
          <EmptyStateScreen
            CTAButtonProps={{
              onClick: () => {
                open(ModifyPasswordModal, {
                  type: 'create'
                })
              },
              tProps: { item: t('items.password') },
              icon: 'tabler:plus',
              children: 'new'
            }}
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
    </WithQuery>
  )
}

export default PasswordList
