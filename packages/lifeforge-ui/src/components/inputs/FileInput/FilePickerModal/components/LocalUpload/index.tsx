import { parse } from 'file-type-mime'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-toastify'

import DnDContainer from './components/DnDContainer'
import PreviewContainer from './components/PreviewContainer'

function LocalUpload({
  acceptedMimeTypes,
  setFile,
  file,
  setPreview,
  preview
}: {
  acceptedMimeTypes?: Record<string, string[]>
  setFile: (file: File | string | null) => void
  file: File | string | null
  setPreview: (preview: string | null) => void
  preview: string | null
}) {
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
    <DnDContainer
      acceptedMimeTypes={acceptedMimeTypes || {}}
      getInputProps={getInputProps}
      getRootProps={getRootProps}
      isDragActive={isDragActive}
      setFile={setFile}
      setPreview={setPreview}
    />
  ) : (
    <PreviewContainer
      file={file as File}
      preview={preview}
      setFile={setFile}
      setPreview={setPreview}
    />
  )
}

export default LocalUpload
