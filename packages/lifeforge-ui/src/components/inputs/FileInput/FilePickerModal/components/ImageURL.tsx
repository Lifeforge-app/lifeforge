import { TextInput } from '@components/inputs'
import { Icon } from '@iconify/react'

function ImageURL({
  file,
  setFile,
  setPreview
}: {
  file: string | File | null
  setFile: React.Dispatch<React.SetStateAction<string | File | null>>
  setPreview: React.Dispatch<React.SetStateAction<string | null>>
}) {
  return (
    <>
      <TextInput
        icon="tabler:link"
        label="imagePicker.inputs.imageLink"
        namespace="common.modals"
        placeholder="https://example.com/image.jpg"
        setValue={(value: string) => {
          setFile(value)
          setPreview(value)
        }}
        value={file === null ? '' : (file as string)}
      />

      <div className="bg-bg-200 dark:bg-bg-800/50 relative isolate mt-4 flex min-h-0 flex-1 flex-col overflow-hidden rounded-md">
        <img alt="" className="h-full object-contain" src={file as string} />
        <Icon
          className="text-bg-300 dark:text-bg-700 absolute top-1/2 left-1/2 z-[-1] size-32 -translate-x-1/2 -translate-y-1/2"
          icon="tabler:photo"
        />
      </div>
    </>
  )
}

export default ImageURL
