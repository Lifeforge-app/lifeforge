import { Icon } from '@iconify/react'
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
      className="flex-center flex w-full flex-col rounded-lg border-[3px] border-dashed border-bg-500 py-12"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <Icon icon="tabler:drag-drop" className="h-20 w-20 text-bg-500" />
      <div className="mt-4 text-center text-2xl font-medium text-bg-500">
        {isDragActive ? "Drop it like it's hot" : 'Drag and drop to upload'}
      </div>
      <div className="mt-4 text-center text-lg font-semibold uppercase tracking-widest text-bg-500">
        or
      </div>
      <label
        htmlFor="idea-image"
        className="mt-4 flex items-center gap-2 rounded-lg bg-bg-500 p-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 transition-all hover:bg-bg-600 dark:bg-bg-100 dark:text-bg-800 dark:hover:bg-bg-200"
      >
        <Icon icon="tabler:upload" className="h-5 w-5" />
        Upload image
      </label>
    </div>
  )
}

export default IdeaImageUpload
