import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

function IdeaImagePreview({
  preview,
  setPreview
}: {
  preview: string | ArrayBuffer | null
  setPreview: React.Dispatch<React.SetStateAction<string | ArrayBuffer | null>>
}): React.ReactElement {
  return (
    <div className="flex items-center justify-center">
      <div className="relative flex h-[30rem] min-h-[8rem] w-full items-center justify-center overflow-hidden rounded-lg bg-neutral-800">
        <img
          src={preview as string}
          alt="preview"
          className="h-full w-full object-scale-down"
        />
        <button
          onClick={() => {
            setPreview(null)
          }}
          className="absolute right-4 top-4 rounded-lg bg-neutral-800 p-2 text-neutral-500 transition-all hover:bg-neutral-900"
        >
          <Icon icon="tabler:x" className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

export default IdeaImagePreview
