import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  Box,
  ContentWrapperWithSidebar,
  EmptyStateScreen,
  FAB,
  LayoutWithSidebar,
  Scrollbar,
  Stack,
  WithQuery,
  toast,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { PasswordEntry } from '..'
import useFilter from '../hooks/useFilter'
import { useVEKContext } from '../providers/VEKProvider'
import InnerHeader from './InnerHeader'
import MainHeader from './MainHeader'
import PasswordEntryItem from './PasswordEntryItem'
import Sidebar from './Sidebar'
import ModifyPasswordModal from './modals/ModifyPasswordModal'

function ContentContainer({ masterPassword }: { masterPassword: string }) {
  const { t } = useModuleTranslation()
  const queryClient = useQueryClient()
  const { open } = useModalStore()
  const { filter, searchQuery } = useFilter()
  const vek = useVEKContext()

  const passwordListQuery = useQuery(
    forgeAPI.entries.list.queryOptions({
      enabled: masterPassword !== ''
    })
  )

  const filteredPasswordList = useMemo(() => {
    const passwordList = passwordListQuery.data

    if (!passwordList) return []

    let filtered = passwordList

    if (searchQuery !== '') {
      filtered = filtered.filter(
        password =>
          password.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          password.website.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (filter.category) {
      filtered = filtered.filter(
        password => password.category === filter.category
      )
    }

    return filtered
  }, [searchQuery, filter.category, passwordListQuery.data])

  async function pinPassword(id: string) {
    const mapPasswords = (p: PasswordEntry) =>
      p.id === id ? { ...p, pinned: !p.pinned } : p

    const sortPasswords = (a: PasswordEntry, b: PasswordEntry) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1

      return 0
    }

    try {
      await forgeAPI.entries.togglePin.input({ id }).mutate(undefined)

      queryClient.setQueryData<PasswordEntry[]>(
        forgeAPI.entries.list.key,
        prev => {
          if (!prev) return prev

          return prev.map(mapPasswords).sort(sortPasswords)
        }
      )
    } catch {
      toast.error(t('error.pin'))
      queryClient.invalidateQueries({ queryKey: forgeAPI.entries.list.key })
    }
  }

  const handleCreatePassword = useCallback(() => {
    if (!vek) return

    open(ModifyPasswordModal, {
      type: 'create',
      vek
    })
  }, [open, vek])

  return (
    <>
      <MainHeader />
      <LayoutWithSidebar>
        <Sidebar />
        <ContentWrapperWithSidebar>
          <InnerHeader totalItemsCount={filteredPasswordList.length} />
          <WithQuery query={passwordListQuery}>
            {() =>
              filteredPasswordList.length === 0 ? (
                <EmptyStateScreen
                  icon="tabler:key-off"
                  message={{
                    id: passwordListQuery.data?.length ? 'search' : 'passwords'
                  }}
                />
              ) : (
                <Box asChild mt="lg">
                  <Scrollbar>
                    <Stack gap="sm" mb="xl" p="sm">
                      {filteredPasswordList.map(password => (
                        <PasswordEntryItem
                          key={password.id}
                          password={password}
                          pinPassword={pinPassword}
                        />
                      ))}
                    </Stack>
                  </Scrollbar>
                </Box>
              )
            }
          </WithQuery>
        </ContentWrapperWithSidebar>
        <FAB visibilityBreakpoint="lg" onClick={handleCreatePassword} />
      </LayoutWithSidebar>
    </>
  )
}

export default ContentContainer
