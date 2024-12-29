import React from 'react'
import Button from '@components/ButtonsAndInputs/Button'

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
  file: File | null
  setFile: (file: File | null) => void
  fileName?: string
  onRemove?: () => void
}): React.ReactElement {
  return (
    <div className="flex-center flex flex-1">
      {preview !== null && (
        <div className="flex-center relative min-h-32 w-full overflow-hidden rounded-lg bg-bg-200/50 p-6 shadow-custom dark:bg-bg-800/50">
          <div className="flex-between mb-6 ml-4 flex">
            <p className="w-full truncate">{fileName ?? file?.name}</p>
            <Button
              icon="tabler:x"
              onClick={() => {
                setPreview(null)
                setFile(null)
                onRemove?.()
              }}
              variant="no-bg"
            />
          </div>
          <img src={preview} alt="" className="m-auto max-h-96 rounded-md" />
        </div>
      )}
      {file !== null && preview === null && (
        <div className="mb-6 flex w-full items-center justify-between gap-8">
          <p className="w-full truncate">{file.name}</p>
          <Button
            onClick={() => {
              setPreview(null)
              setFile(null)
              onRemove?.()
            }}
            variant="no-bg"
            className="!p-2"
            icon="tabler:x"
          />
        </div>
      )}
    </div>
  )
}

export default PreviewContainer
