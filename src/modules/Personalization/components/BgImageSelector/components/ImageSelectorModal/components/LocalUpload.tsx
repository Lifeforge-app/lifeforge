import { Icon } from '@iconify/react'
import { t } from 'i18next'
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Button from '@components/ButtonsAndInputs/Button'

function LocalUpload({
  setFile,
  file
}: {
  setFile: (file: File | string | null) => void
  file: File | string | null
}): React.ReactElement {
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = new FileReader()

    file.onload = function () {
      setPreview(file.result)
    }

    file.readAsDataURL(acceptedFiles[0])
    setFile(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop
  })

  return file === null ? (
    <div
      className="flex-center flex size-full flex-1 flex-col rounded-lg border-[3px] border-dashed border-bg-500 py-12"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <Icon icon="tabler:drag-drop" className="size-20 text-bg-500" />
      <div className="mt-4 text-center text-2xl font-medium text-bg-500">
        {isDragActive ? t('dnd.dropHere') : t('dnd.dragAndDropToUpload')}
      </div>
      <div className="mt-4 text-center text-lg font-semibold uppercase tracking-widest text-bg-500">
        {t('auth.or')}
      </div>
      <Button
        CustomElement="label"
        icon="tabler:upload"
        className="mt-4"
        variant="secondary"
      >
        upload from local
      </Button>
    </div>
  ) : (
    <div className="flex-center flex flex-1">
      <div className="flex-center relative flex h-[30rem] min-h-32 w-full overflow-hidden rounded-lg bg-bg-200/50 shadow-custom dark:bg-bg-800/50">
        <img
          src={preview as string}
          alt="preview"
          className="size-full object-scale-down"
        />
        <Button
          icon="tabler:x"
          onClick={() => {
            setPreview(null)
            setFile(null)
          }}
          variant="no-bg"
          className="absolute right-4 top-4"
        />
      </div>
    </div>
  )
}

export default LocalUpload
