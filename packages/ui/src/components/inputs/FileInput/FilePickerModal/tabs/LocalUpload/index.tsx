import { parse } from 'file-type-mime'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

import { toast } from '@/providers'

import { useFilePicker } from '../../contexts/FilePickerContext'
import { DnDContainer } from './components/DnDContainer'
import { PreviewContainer } from './components/PreviewContainer'

export function LocalUpload() {
  const { acceptedMimeTypes, file, preview, setFile, setPreview } =
    useFilePicker()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles[0]
      .arrayBuffer()
      .then(buffer => {
        const mimeType = parse(buffer)

        if (acceptedMimeTypes) {
          const acceptedMimeTypesFlattened = Object.entries(acceptedMimeTypes)
            .flatMap(([type, exts]) => exts.map(ext => `${type}/${ext}`))
            .join(', ')

          if (!acceptedMimeTypesFlattened.includes(mimeType?.mime ?? '')) {
            toast.error(`Unsupported file type: ${mimeType?.mime ?? ''}`)

            return
          }
        }

        if (mimeType !== undefined && mimeType.mime.startsWith('image')) {
          const reader = new FileReader()

          reader.onload = function () {
            setPreview(reader.result as string)
          }

          reader.readAsDataURL(acceptedFiles[0])
        }

        setFile(acceptedFiles[0])
      })
      .catch(console.error)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: acceptedMimeTypes,
    onDrop
  })

  return file === null ? (
    <DnDContainer
      getInputProps={getInputProps}
      getRootProps={getRootProps}
      isDragActive={isDragActive}
    />
  ) : (
    <PreviewContainer file={file as File} preview={preview} />
  )
}
