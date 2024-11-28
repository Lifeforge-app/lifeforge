import React from 'react'
import Button from '@components/ButtonsAndInputs/Button'

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
            setImageLink('')
          }}
          variant="no-bg"
          className="absolute right-4 top-4"
        />
      </div>
    </div>
  )
}

export default IdeaImagePreview
