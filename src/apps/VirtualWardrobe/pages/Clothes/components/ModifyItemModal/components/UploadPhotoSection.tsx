import { Button, ImageAndFileInput } from '@lifeforge/ui'

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
  setBackPreview,
  setOpenImagePickerFor
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
  setOpenImagePickerFor: (value: 'front' | 'back') => void
}) {
  return (
    <>
      <div className="mt-6 flex gap-4">
        <ImageAndFileInput
          required
          icon="tabler:shirt-sport"
          image={frontImage}
          name="Front Image"
          namespace="apps.virtualWardrobe"
          preview={frontPreview}
          setImage={setFrontImage as (value: File | null | string) => void}
          setImagePickerModalOpen={() => {
            setOpenImagePickerFor('front')
          }}
          setPreview={setFrontPreview}
          onImageRemoved={() => {
            setFrontImage(null)
            setFrontPreview(null)
          }}
        />
        <ImageAndFileInput
          required
          icon="tabler:shirt"
          image={backImage}
          name="Back Image"
          namespace="apps.virtualWardrobe"
          preview={backPreview}
          setImage={setBackImage as (value: File | null | string) => void}
          setImagePickerModalOpen={() => {
            setOpenImagePickerFor('back')
          }}
          setPreview={setBackPreview}
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
