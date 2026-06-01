import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import prettyBytes from 'pretty-bytes'
import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

import {
  Box,
  Card,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  Flex,
  Icon,
  Text,
  useModalStore
} from '@lifeforge/ui'

import forgeAPI from '@/forgeAPI'

function BackupItem({
  backup
}: {
  backup: {
    key: string
    size: number
    modified: string
  }
}) {
  const queryClient = useQueryClient()

  const { open } = useModalStore()

  const [downloadLoading, setDownloadLoading] = useState(false)

  const deleteMutation = useMutation(
    forgeAPI.backups.remove
      .input({
        key: backup.key
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['backups'] })
        },
        onError: (error: Error) => {
          toast.error('Failed to delete backup: ' + error.message)
        }
      })
  )

  const handleDownloadBackup = useCallback(async () => {
    setDownloadLoading(true)

    const buffer = (await forgeAPI.backups.download
      .input({
        key: backup.key
      })
      .query()) as unknown as Buffer

    if (!buffer) {
      toast.error('Failed to download backup')
      setDownloadLoading(false)

      return
    }

    const blob = new Blob([buffer as any], { type: 'application/zip' })

    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')

    link.href = url
    link.download = backup.key
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setDownloadLoading(false)
  }, [backup.key])

  const handleDeleteBackup = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete Backup',
      description: `Are you sure you want to delete the backup "${backup.key}"? This action cannot be undone.`,
      confirmationButton: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(undefined)
      }
    })
  }, [backup.key])

  return (
    <Card align="center" as="li" direction="row" gap="lg" justify="between">
      <Flex align="center" gap="md" minWidth="0" width="100%">
        <Icon color="muted" icon="tabler:file-zip" ml="sm" size="2em" />
        <Box minWidth="0" width="100%">
          <Flex asChild align="baseline" gap="sm" minWidth="0" width="100%">
            <Text as="h3" weight="medium">
              <Text truncate size="lg">
                {backup.key}
              </Text>{' '}
              <Text color="muted" size="sm" whiteSpace="nowrap">
                ({prettyBytes(backup.size)})
              </Text>
            </Text>
          </Flex>
          <Text color="muted" mt="xs" size="sm">
            {dayjs(backup.modified).format('MMM D, YYYY h:mm A')}
          </Text>
        </Box>
      </Flex>
      <ContextMenu>
        <ContextMenuItem
          icon="tabler:download"
          label="Download"
          loading={downloadLoading}
          onClick={handleDownloadBackup}
        />
        <ContextMenuItem
          dangerous
          icon="tabler:trash"
          label="Delete"
          onClick={handleDeleteBackup}
        />
      </ContextMenu>
    </Card>
  )
}

export default BackupItem
