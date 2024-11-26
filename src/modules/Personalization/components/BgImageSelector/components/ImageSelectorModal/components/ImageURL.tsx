import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import Input from '@components/ButtonsAndInputs/Input'

function ImageURL({
  file,
  setFile
}: {
  file: string | File | null
  setFile: React.Dispatch<React.SetStateAction<string | File | null>>
}): React.ReactElement {
  return (
    <>
      <Input
        icon="tabler:link"
        name="Image link"
        placeholder="https://example.com/image.jpg"
        value={file === null ? '' : (file as string)}
        updateValue={setFile}
        darker
      />

      <div className="relative isolate mt-4 flex min-h-0 flex-1 flex-col overflow-hidden rounded-md bg-bg-200 dark:bg-bg-800/50">
        <img src={file as string} alt="" className="h-full object-contain" />
        <Icon
          icon="tabler:photo"
          className="absolute left-1/2 top-1/2 z-[-1] size-32 -translate-x-1/2 -translate-y-1/2 text-bg-300 dark:text-bg-700"
        />
      </div>
    </>
  )
}

export default ImageURL
