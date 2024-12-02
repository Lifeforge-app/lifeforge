import React from 'react'
import CurrencyInputComponent from '@components/ButtonsAndInputs/CurrencyInput'
import ImageAndFileInput from '@components/ButtonsAndInputs/ImageAndFilePicker/ImageAndFileInput'
import Input from '@components/ButtonsAndInputs/Input'

function DataInput({
  name,
  setName,
  price,
  setPrice,
  image,
  setImage,
  preview,
  setPreview,
  setImagePickerOpen
}: {
  name: string
  setName: (name: string) => void
  price: string
  setPrice: (price: string) => void
  image: File | string | null
  setImage: React.Dispatch<React.SetStateAction<File | string | null>>
  preview: string | null
  setPreview: React.Dispatch<React.SetStateAction<string | null>>
  setImagePickerOpen: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
  return (
    <div className="space-y-4">
      <Input
        icon="tabler:tag"
        name="Product Name"
        value={name}
        updateValue={setName}
        darker
        placeholder="iPhone 99 Pro Max Plus Ultra Special Edition 5G +"
      />
      <CurrencyInputComponent
        name="Product Price"
        value={price}
        updateValue={value => {
          setPrice(value ?? '0')
        }}
        icon="tabler:currency-dollar"
        placeholder="0.00"
        darker
        className="w-full"
      />
      <ImageAndFileInput
        icon="tabler:photo"
        name="Product Image"
        image={image}
        setImage={setImage}
        preview={preview}
        setPreview={setPreview}
        reminderText="Only images are allowed"
        setImagePickerModalOpen={setImagePickerOpen}
      />
    </div>
  )
}

export default DataInput
