import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import ImagePickerModal from '@components/ButtonsAndInputs/ImageAndFilePicker/ImagePickerModal'
import Input from '@components/ButtonsAndInputs/Input'
import ListboxOrComboboxInput from '@components/ButtonsAndInputs/ListboxOrComboboxInput'
import ListboxOrComboboxOption from '@components/ButtonsAndInputs/ListboxOrComboboxInput/components/ListboxOrComboboxOption'
import ModalHeader from '@components/Modals/ModalHeader'
import ModalWrapper from '@components/Modals/ModalWrapper'
import ErrorScreen from '@components/Screens/ErrorScreen'
import LoadingScreen from '@components/Screens/LoadingScreen'
import APIRequest from '@utils/fetchData'
import DataInput from './components/DataInput'

const PROVIDERS = [
  {
    id: 'shopee',
    name: 'Shopee',
    icon: 'simple-icons:shopee',
    color: '#ee4d2d'
  },
  {
    id: 'lazada',
    name: 'Lazada',
    icon: 'arcticons:lazada',
    color: '#fa0de2'
  }
]

function FromOtherAppsModal({
  isOpen,
  onClose,
  onCreate
}: {
  isOpen: boolean
  onClose: () => void
  onCreate: () => void
}): React.ReactElement {
  const [provider, setProvider] = useState('shopee')
  const [url, setUrl] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState<'loading' | 'error' | false>(false)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('0')
  const [image, setImage] = useState<File | string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [imagePickerOpen, setImagePickerOpen] = useState(false)

  async function fetchData(): Promise<void> {
    setLoading('loading')

    await APIRequest({
      endpoint: 'wishlist/entries/external',
      method: 'POST',
      body: {
        provider,
        url
      },
      callback(data) {
        const { name, price, image } = data.data
        setLoading(false)
        setName(name ?? '')
        setPrice(price.toString() ?? '0')
        setImage(image)
        setPreview(image)
      },
      onFailure() {
        setLoading('error')
      }
    })
  }

  useEffect(() => {
    if (!isOpen) {
      setProvider('shopee')
      setUrl('')
      setShowResults(false)
      setName('')
      setPrice('0')
      setImage(null)
      setPreview(null)
    }
  }, [isOpen])

  return (
    <>
      <ModalWrapper isOpen={isOpen} minWidth="50vw">
        <ModalHeader
          title="Import from other apps"
          icon="tabler:apps"
          onClose={onClose}
        />

        {!showResults ? (
          <div className="space-y-4">
            <ListboxOrComboboxInput
              type="listbox"
              icon="tabler:apps"
              value={provider}
              setValue={setProvider}
              name="Provider"
              buttonContent={
                <>
                  <Icon
                    icon={
                      PROVIDERS.find(l => l.id === provider)?.icon ??
                      'tabler:apps-off'
                    }
                    style={{
                      color: PROVIDERS.find(l => l.id === provider)?.color
                    }}
                    className="size-5"
                  />
                  <span className="-mt-px block truncate">
                    {PROVIDERS.find(l => l.id === provider)?.name ?? 'None'}
                  </span>
                </>
              }
            >
              {PROVIDERS.map(({ name, color, id, icon }, i) => (
                <ListboxOrComboboxOption
                  key={i}
                  text={name}
                  icon={icon}
                  color={color}
                  value={id}
                />
              ))}
            </ListboxOrComboboxInput>
            <Input
              icon="tabler:link"
              name="Product URL"
              value={url}
              updateValue={setUrl}
              darker
              placeholder={
                provider === 'shopee'
                  ? 'https://my.shp.ee/....'
                  : 'https://s.lazada.com.my/....'
              }
            />
            <Button
              onClick={() => {
                setShowResults(true)
                fetchData().catch(console.error)
              }}
              icon="tabler:arrow-right"
              iconAtEnd
              className="w-full"
            >
              Import
            </Button>
          </div>
        ) : (
          (() => {
            switch (loading) {
              case 'loading':
                return <LoadingScreen />
              case 'error':
                return <ErrorScreen message="Failed to product details" />
              case false:
                return (
                  <DataInput
                    url={url}
                    name={name}
                    price={price}
                    image={image}
                    preview={preview}
                    setUrl={setUrl}
                    setName={setName}
                    setPrice={setPrice}
                    setImage={setImage}
                    setPreview={setPreview}
                    setImagePickerOpen={setImagePickerOpen}
                    onClose={onClose}
                    onCreate={onCreate}
                  />
                )
            }
          })()
        )}
      </ModalWrapper>
      <ImagePickerModal
        isOpen={imagePickerOpen}
        onClose={() => {
          setImagePickerOpen(false)
        }}
        acceptedMimeTypes={{
          'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
        }}
        onSelect={async (file, preview) => {
          setImage(file)
          setPreview(preview)
          setImagePickerOpen(false)
        }}
        enableUrl
      />
    </>
  )
}

export default FromOtherAppsModal
