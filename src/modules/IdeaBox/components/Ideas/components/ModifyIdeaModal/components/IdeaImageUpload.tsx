import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

function IdeaImageUpload({
  getRootProps,
  getInputProps,
  isDragActive
}: {
  getRootProps: any
  getInputProps: any
  isDragActive: boolean
}): React.ReactElement {
  return (
    <div
      className="flex w-full flex-col items-center justify-center rounded-lg border-[3px] border-dashed border-neutral-500 py-12"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <Icon icon="tabler:drag-drop" className="h-20 w-20 text-neutral-500" />
      <div className="mt-4 text-center text-2xl font-medium text-neutral-500">
        {isDragActive ? "Drop it like it's hot" : 'Drag and drop to upload'}
      </div>
      <div className="mt-4 text-center text-lg font-semibold uppercase tracking-widest text-neutral-400">
        or
      </div>
      <label
        htmlFor="idea-image"
        className="mt-4 flex items-center gap-2 rounded-lg bg-neutral-500 p-4 pr-5 font-semibold uppercase tracking-wider text-neutral-100 transition-all hover:bg-neutral-600 dark:bg-neutral-100 dark:text-neutral-800 dark:hover:bg-neutral-200"
      >
        <Icon icon="tabler:upload" className="h-5 w-5" />
        Upload image
      </label>
    </div>
  )
}

export default IdeaImageUpload
