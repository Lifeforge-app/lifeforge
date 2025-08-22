import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import forgeAPI from '@utils/forgeAPI'
import {
  Button,
  EmptyStateScreen,
  FAB,
  ModuleHeader,
  SearchInput,
  WithQuery,
  useModalStore
} from 'lifeforge-ui'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import type { PasswordEntry } from '..'
import ModifyPasswordModal from '../modals/ModifyPasswordModal'
import PasswordEntryItem from './PasswordEntryItem'

function ContentContainer({ masterPassword }: { masterPassword: string }) {
  const queryClient = useQueryClient()

  const open = useModalStore(state => state.open)

  const { t } = useTranslation('apps.passwords')

  const [query, setQuery] = useState('')

  const debouncedQuery = useDebounce(query, 300)

  const passwordListQuery = useQuery(
    forgeAPI.passwords.entries.list.queryOptions({
      enabled: masterPassword !== ''
    })
  )

  const filteredPasswordList = useMemo(() => {
    const passwordList = passwordListQuery.data

    if (!passwordList) {
      return []
    }

    if (debouncedQuery === '') {
      return passwordList
    }

    return passwordList.filter(
      password =>
        password.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        password.website.toLowerCase().includes(debouncedQuery.toLowerCase())
    )
  }, [debouncedQuery, passwordListQuery.data])

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

  const handleCreatePassword = useCallback(() => {
    open(ModifyPasswordModal, {
      type: 'create',
      masterPassword
    })
  }, [])

  return (
    <>
      <ModuleHeader
        actionButton={
          masterPassword !== '' && (
            <Button
              className="hidden lg:flex"
              icon="tabler:plus"
              tProps={{ item: t('items.password') }}
              onClick={handleCreatePassword}
            >
              new
            </Button>
          )
        }
        icon="tabler:key"
        title="Passwords"
      />
      <SearchInput
        namespace="apps.passwords"
        searchTarget="password"
        setValue={setQuery}
        value={query}
      />
      <WithQuery query={passwordListQuery}>
        {() =>
          filteredPasswordList.length === 0 ? (
            <EmptyStateScreen
              CTAButtonProps={{
                onClick: handleCreatePassword,
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
                  masterPassword={masterPassword}
                  password={password}
                  pinPassword={pinPassword}
                />
              ))}
            </div>
          )
        }
      </WithQuery>
      <FAB visibilityBreakpoint="lg" onClick={handleCreatePassword} />
    </>
  )
}

export default ContentContainer
