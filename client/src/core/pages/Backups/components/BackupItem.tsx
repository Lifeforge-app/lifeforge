import { Icon } from '@iconify/react'
import { useQueryClient } from '@tanstack/react-query'
import {
  Button,
  DeleteConfirmationModal,
  HamburgerMenu,
  MenuItem,
  useModalStore
} from 'lifeforge-ui'
import prettyBytes from 'pretty-bytes'
import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

import { fetchAPI } from 'shared/lib'

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

  const handleDownloadBackup = useCallback(async () => {
    setDownloadLoading(true)
    const buffer = await fetchAPI<Buffer>(
      import.meta.env.VITE_API_URL,
      `/backups/download/${backup.key}`
    )

    if (!buffer) {
      toast.error('Failed to download backup')
      setDownloadLoading(false)
      return
    }

    const blob = new Blob([buffer], { type: 'application/zip' })
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
    open(DeleteConfirmationModal, {
      apiEndpoint: `/backups/${backup.key}`,
      itemName: 'backup',
      confirmationText: 'Delete this backup',
      updateDataList: () => {
        queryClient.invalidateQueries({
          queryKey: ['backups']
        })
      }
    })
  }, [backup.key])

  return (
    <div className="shadow-custom component-bg flex items-center justify-between gap-6 rounded-lg p-4">
      <div className="flex w-full min-w-0 items-center gap-3">
        <Icon
          className="text-bg-500 ml-2 size-7 shrink-0"
          icon="tabler:file-zip"
        />
        <h3 className="flex w-full min-w-0 items-end gap-2 text-lg font-medium">
          <p className="truncate">{backup.key}</p>{' '}
          <p className="text-bg-500 mb-0.5 block text-sm whitespace-nowrap">
            ({prettyBytes(backup.size)})
          </p>
        </h3>
      </div>
      <div className="hidden shrink-0 items-center gap-2 sm:flex">
        <Button
          icon="tabler:download"
          loading={downloadLoading}
          variant="plain"
          onClick={handleDownloadBackup}
        />
        <Button
          isRed
          icon="tabler:trash"
          variant="plain"
          onClick={handleDeleteBackup}
        />
      </div>
      <HamburgerMenu
        classNames={{
          wrapper: 'flex sm:hidden'
        }}
      >
        <MenuItem
          icon="tabler:download"
          loading={downloadLoading}
          text="Download"
          onClick={handleDownloadBackup}
        />
        <MenuItem
          isRed
          icon="tabler:trash"
          text="Delete"
          onClick={handleDeleteBackup}
        />
      </HamburgerMenu>
    </div>
  )
}

export default BackupItem
