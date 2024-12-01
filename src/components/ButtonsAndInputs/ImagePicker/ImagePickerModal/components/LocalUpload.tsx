import { Icon } from '@iconify/react'
import { parse } from 'file-type-mime'
import { t } from 'i18next'
import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Button from '@components/ButtonsAndInputs/Button'

function LocalUpload({
  acceptedMimeTypes,
  setFile,
  file,
  setPreview,
  preview
}: {
  acceptedMimeTypes: Record<string, string[]>
  setFile: (file: File | string | null) => void
  file: File | string | null
  setPreview: (preview: string | null) => void
  preview: string | null
}): React.ReactElement {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles[0]
      .arrayBuffer()
      .then(buffer => {
        const mimeType = parse(buffer)

        if (mimeType !== undefined && mimeType.mime.startsWith('image')) {
          const file = new FileReader()

          file.onload = function () {
            setPreview(file.result as string)
          }

          file.readAsDataURL(acceptedFiles[0])
        }

        setFile(acceptedFiles[0])
      })
      .catch(console.error)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedMimeTypes
  })

  return file === null ? (
    <div
      className="flex-center flex size-full min-h-96 flex-1 flex-col rounded-lg border-[3px] border-dashed border-bg-500 py-12"
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
        className="mt-4 cursor-pointer"
        variant="secondary"
      >
        upload from local
      </Button>
    </div>
  ) : (
    <div className="flex-center flex flex-1">
      {preview !== null && (
        <div className="flex-center relative flex h-[30rem] min-h-32 w-full overflow-hidden rounded-lg bg-bg-200/50 shadow-custom dark:bg-bg-800/50">
          <img src={preview} alt="" className="m-auto max-h-96 rounded-md" />
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
      )}
      {file !== null && preview === null && (
        <div className="mb-6 flex w-full items-center justify-between gap-8">
          <p className="w-full truncate">{(file as File).name}</p>
          <Button
            onClick={() => {
              setPreview(null)
              setFile(null)
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

export default LocalUpload
