import type { PasswordEntry } from '@'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  ContextMenu,
  ContextMenuItem,
  Flex,
  ModuleHeader,
  toast,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import { useVEKContext } from '@/providers/VEKProvider'
import { decrypt } from '@/utils/crypto'

import ModifyPasswordModal from './modals/ModifyPasswordModal'
import RotateMasterPasswordModal from './modals/RotateMasterPasswordModal'

function MainHeader() {
  const { t } = useModuleTranslation()
  const queryClient = useQueryClient()
  const { open } = useModalStore()
  const vek = useVEKContext()

  const handleCreatePassword = useCallback(() => {
    if (!vek) return

    open(ModifyPasswordModal, {
      type: 'create',
      vek
    })
  }, [open, vek])

  const handleExport = useCallback(async () => {
    if (!vek) return

    try {
      const entries =
        queryClient.getQueryData<PasswordEntry[]>(forgeAPI.entries.list.key) ||
        []

      const decryptedEntries = await Promise.all(
        entries.map(async entry => ({
          ...entry,
          password: await decrypt(entry.password, vek)
        }))
      )

      const headers = [
        'Name',
        'Username',
        'Password',
        'Website',
        'Last Modified'
      ]

      const csvContent = [
        headers.join(','),
        ...decryptedEntries.map((row: PasswordEntry) =>
          [
            row.name,
            row.username,
            row.password,
            row.website,
            row.last_password_updated
          ]
            .map(field => `"${(field || '').replace(/"/g, '""')}"`)
            .join(',')
        )
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', 'passwords_export.csv')
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      console.error(error)
      toast.error(t('toasts.exportFailed'))
    }
  }, [vek, queryClient])

  return (
    <ModuleHeader
      trailing={
        vek && (
          <>
            <Flex gap="sm">
              <Button
                display={{ base: 'none', lg: 'flex' }}
                icon="tabler:plus"
                tProps={{ item: t('items.password') }}
                onClick={handleCreatePassword}
              >
                new
              </Button>
            </Flex>
            <ContextMenu
              componentProps={{
                menu: { minWidth: '18em' }
              }}
            >
              <ContextMenuItem
                icon="tabler:file-export"
                label="exportToCsv"
                onClick={handleExport}
              />
              <ContextMenuItem
                icon="tabler:key"
                label="rotateMasterPassword"
                onClick={() => {
                  open(RotateMasterPasswordModal, { vek })
                }}
              />
            </ContextMenu>
          </>
        )
      }
    />
  )
}

export default MainHeader
