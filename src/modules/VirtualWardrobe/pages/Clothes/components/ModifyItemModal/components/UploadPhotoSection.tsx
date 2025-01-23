import React from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import ImageAndFileInput from '@components/ButtonsAndInputs/ImageAndFilePicker/ImageAndFileInput'

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
}): React.ReactElement {
  return (
    <>
      <div className="mt-6 flex gap-4">
        <ImageAndFileInput
          icon="tabler:shirt-sport"
          image={frontImage}
          name="Front Image"
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
          required
        />
        <ImageAndFileInput
          icon="tabler:shirt"
          image={backImage}
          name="Back Image"
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
          required
        />
      </div>
      <div className="mt-6 flex justify-between">
        <Button
          className="mt-6 w-full"
          onClick={() => {
            setStep(step + 1)
          }}
          disabled={frontImage === null || backImage === null}
          icon="tabler:arrow-right"
          iconAtEnd
        >
          Next
        </Button>
      </div>
    </>
  )
}

export default UploadPhotoSection
