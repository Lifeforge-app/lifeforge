import { Icon } from '@iconify/react'
import { useMemo } from 'react'

import { Button } from '@components/inputs'

import FILE_ICONS from '../../../constants/file_icons'

function PreviewContainer({
  preview,
  setPreview,
  file,
  setFile,
  fileName,
  onRemove
}: {
  preview: string | null
  setPreview: (preview: string | null) => void
  file: File | string | null
  setFile: (file: File | null) => void
  fileName?: string
  onRemove?: () => void
}) {
  const finalFileName = useMemo(() => {
    if (fileName) return fileName
    if (typeof file === 'string') return file.split('/').pop()
    if (file instanceof File) return file.name

    return undefined
  }, [file, fileName])

  return (
    <div className="flex-center w-full min-w-0 flex-1">
      {preview !== null && (
        <div className="bg-bg-200/50 shadow-custom dark:bg-bg-800/50 relative flex min-h-32 w-full flex-col overflow-hidden rounded-lg p-4">
          <div className="flex-between mb-6 ml-4 flex">
            <div className="flex w-full items-center gap-3">
              <Icon
                className="text-bg-500 size-6 shrink-0"
                icon={
                  FILE_ICONS[
                    finalFileName?.split('.').pop() as keyof typeof FILE_ICONS
                  ] || 'tabler:file'
                }
              />
              <p className="w-full truncate">{finalFileName}</p>
            </div>
            <Button
              icon="tabler:x"
              variant="plain"
              onClick={() => {
                setPreview(null)
                setFile(null)
                onRemove?.()
              }}
            />
          </div>
          <img
            alt=""
            className="max-h-96 rounded-md object-contain"
            src={preview}
          />
        </div>
      )}
      {file !== null && preview === null && (
        <div className="mb-6 flex w-full min-w-0 items-center justify-between gap-8">
          <div className="flex w-full min-w-0 items-center gap-3">
            <Icon
              className="text-bg-500 size-6"
              icon={
                FILE_ICONS[
                  finalFileName?.split('.').pop() as keyof typeof FILE_ICONS
                ] || 'tabler:file'
              }
            />
            <p className="w-full min-w-0 truncate">{finalFileName}</p>
          </div>
          <Button
            className="p-2!"
            icon="tabler:x"
            variant="plain"
            onClick={() => {
              setPreview(null)
              setFile(null)
              onRemove?.()
            }}
          />
        </div>
      )}
    </div>
  )
}

export default PreviewContainer
