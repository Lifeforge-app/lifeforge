import { Icon } from '@iconify/react'
import React from 'react'

function IdeaImagePreview({
  preview,
  setPreview,
  setImageLink
}: {
  preview: string | ArrayBuffer | null
  setPreview: React.Dispatch<React.SetStateAction<string | ArrayBuffer | null>>
  setImageLink: React.Dispatch<React.SetStateAction<string>>
}): React.ReactElement {
  return (
    <div className="flex-center flex">
      <div className="flex-center relative flex h-[30rem] min-h-32 w-full overflow-hidden rounded-lg bg-bg-800">
        <img
          src={preview as string}
          alt="preview"
          className="size-full object-scale-down"
        />
        <button
          onClick={() => {
            setPreview(null)
            setImageLink('')
          }}
          className="absolute right-4 top-4 rounded-lg bg-bg-800 p-2 text-bg-500 transition-all hover:bg-bg-900"
        >
          <Icon icon="tabler:x" className="size-5" />
        </button>
      </div>
    </div>
  )
}

export default IdeaImagePreview
