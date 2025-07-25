import { Button, FileInput } from 'lifeforge-ui'

function UploadPhotoSection({
  step,
  setStep,
  frontImage,
  setFrontImage,
  backImage,
  setBackImage,
  frontPreview,
  setFrontPreview,
  backPreview,
  setBackPreview
}: {
  step: number
  setStep: (value: number) => void
  frontImage: File | null
  setFrontImage: (value: File | null) => void
  backImage: File | null
  setBackImage: (value: File | null) => void
  frontPreview: string | null
  setFrontPreview: (value: string | null) => void
  backPreview: string | null
  setBackPreview: (value: string | null) => void
}) {
  return (
    <>
      <div className="mt-6 flex gap-3">
        <FileInput
          required
          acceptedMimeTypes={{
            'image/*': ['jpg', 'jpeg', 'png', 'gif', 'webp']
          }}
          icon="tabler:shirt-sport"
          image={frontImage}
          name="Front Image"
          namespace="apps.virtualWardrobe"
          preview={frontPreview}
          setData={({ file, preview }) => {
            setFrontImage(file as File)
            setFrontPreview(preview)
          }}
          onImageRemoved={() => {
            setFrontImage(null)
            setFrontPreview(null)
          }}
        />
        <FileInput
          required
          acceptedMimeTypes={{
            'image/*': ['jpg', 'jpeg', 'png', 'gif', 'webp']
          }}
          icon="tabler:shirt"
          image={backImage}
          name="Back Image"
          namespace="apps.virtualWardrobe"
          preview={backPreview}
          setData={({ file, preview }) => {
            setBackImage(file as File)
            setBackPreview(preview)
          }}
          onImageRemoved={() => {
            setBackImage(null)
            setBackPreview(null)
          }}
        />
      </div>
      <div className="mt-6 flex justify-between">
        <Button
          iconAtEnd
          className="mt-6 w-full"
          disabled={frontImage === null || backImage === null}
          icon="tabler:arrow-right"
          onClick={() => {
            setStep(step + 1)
          }}
        >
          Next
        </Button>
      </div>
    </>
  )
}

export default UploadPhotoSection
