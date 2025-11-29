import forgeAPI from '@/utils/forgeAPI'
import { Icon } from '@iconify/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import {
  Button,
  Card,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  useModalStore
} from 'lifeforge-ui'
import prettyBytes from 'pretty-bytes'
import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

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

  const open = useModalStore(state => state.open)

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
        await deleteMutation.mutateAsync({})
      }
    })
  }, [backup.key])

  return (
    <Card as="li" className="flex-between gap-6">
      <div className="flex w-full min-w-0 items-center gap-3">
        <Icon
          className="text-bg-500 ml-2 size-7 shrink-0"
          icon="tabler:file-zip"
        />
        <div className="w-full min-w-0">
          <h3 className="flex w-full min-w-0 items-end gap-2 text-lg font-medium">
            <p className="truncate">{backup.key}</p>{' '}
            <p className="text-bg-500 mb-0.5 block text-sm whitespace-nowrap">
              ({prettyBytes(backup.size)})
            </p>
          </h3>
          <p className="text-bg-500 mt-1 text-sm">
            {dayjs(backup.modified).format('MMM D, YYYY h:mm A')}
          </p>
        </div>
      </div>
      <div className="hidden shrink-0 items-center gap-2 sm:flex">
        <Button
          icon="tabler:download"
          loading={downloadLoading}
          variant="plain"
          onClick={handleDownloadBackup}
        />
        <Button
          dangerous
          icon="tabler:trash"
          variant="plain"
          onClick={handleDeleteBackup}
        />
      </div>
      <ContextMenu
        classNames={{
          wrapper: 'flex sm:hidden'
        }}
      >
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
