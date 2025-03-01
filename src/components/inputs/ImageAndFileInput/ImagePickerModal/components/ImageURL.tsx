import { Icon } from '@iconify/react'
import React from 'react'
import { TextInput } from '@components/inputs'

function ImageURL({
  file,
  setFile,
  setPreview
}: {
  file: string | File | null
  setFile: React.Dispatch<React.SetStateAction<string | File | null>>
  setPreview: React.Dispatch<React.SetStateAction<string | null>>
}): React.ReactElement {
  return (
    <>
      <TextInput
        darker
        icon="tabler:link"
        name="Image link"
        namespace="common.misc"
        placeholder="https://example.com/image.jpg"
        tKey="imageUpload"
        setValue={(value: string) => {
          setFile(value)
          setPreview(value)
        }}
        value={file === null ? '' : (file as string)}
      />

      <div className="relative isolate mt-4 flex min-h-0 flex-1 flex-col overflow-hidden rounded-md bg-bg-200 dark:bg-bg-800/50">
        <img alt="" className="h-full object-contain" src={file as string} />
        <Icon
          className="absolute left-1/2 top-1/2 z-[-1] size-32 -translate-x-1/2 -translate-y-1/2 text-bg-300 dark:text-bg-700"
          icon="tabler:photo"
        />
      </div>
    </>
  )
}

export default ImageURL
