import React, { useState } from 'react'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import CreateOrModifyButton from '@components/ButtonsAndInputs/CreateOrModifyButton'
import CurrencyInputComponent from '@components/ButtonsAndInputs/CurrencyInput'
import ImageAndFileInput from '@components/ButtonsAndInputs/ImageAndFilePicker/ImageAndFileInput'
import Input from '@components/ButtonsAndInputs/Input'
import APIRequest from '@utils/fetchData'

function DataInput({
  url,
  setUrl,
  name,
  setName,
  price,
  setPrice,
  image,
  setImage,
  preview,
  setPreview,
  setImagePickerOpen,
  onClose,
  onCreate
}: {
  url: string
  setUrl: (url: string) => void
  name: string
  setName: (name: string) => void
  price: string
  setPrice: (price: string) => void
  image: File | string | null
  setImage: React.Dispatch<React.SetStateAction<File | string | null>>
  preview: string | null
  setPreview: React.Dispatch<React.SetStateAction<string | null>>
  setImagePickerOpen: React.Dispatch<React.SetStateAction<boolean>>
  onClose: () => void
  onCreate: () => void
}): React.ReactElement {
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(false)

  async function onSubmit(): Promise<void> {
    if (
      url.trim().length === 0 ||
      name.trim().length === 0 ||
      price.trim().length === 0 ||
      image === null
    ) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    await APIRequest({
      endpoint: 'wishlist/entries',
      method: 'POST',
      body: {
        url,
        name,
        price: parseFloat(price),
        image,
        list: id
      },
      successInfo: 'create',
      failureInfo: 'create',
      callback: onCreate,
      finalCallback: () => {
        onClose()
        setLoading(false)
      }
    })
  }

  return (
    <div className="space-y-4">
      <Input
        icon="tabler:link"
        name="Product URL"
        value={url}
        updateValue={setUrl}
        darker
        placeholder="https://my.shp.ee/abcdefg"
      />
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
      <CreateOrModifyButton
        type="create"
        loading={loading}
        onClick={() => {
          onSubmit().catch(console.error)
        }}
        className="w-full"
      />
    </div>
  )
}

export default DataInput
