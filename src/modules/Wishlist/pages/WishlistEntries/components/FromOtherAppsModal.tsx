import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Button } from '@components/buttons'
import { TextInput , ListboxOrComboboxInput , ListboxOrComboboxOption } from '@components/inputs'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import { type IWishlistEntry } from '@interfaces/wishlist_interfaces'
import APIRequest from '@utils/fetchData'

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
  },
  {
    id: 'puzzlePlanet',
    name: 'Puzzle Planet',
    icon: 'tabler:puzzle',
    color: '#f8ca00'
  }
]

function FromOtherAppsModal({
  isOpen,
  onClose,
  setModifyEntryModalOpenType,
  setExistedData
}: {
  isOpen: boolean
  onClose: () => void
  setModifyEntryModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedData: React.Dispatch<
    React.SetStateAction<Partial<IWishlistEntry> | null>
  >
}): React.ReactElement {
  const { id } = useParams<{ id: string }>()
  const [provider, setProvider] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState<'loading' | 'error' | false>(false)

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
        setModifyEntryModalOpenType('create')
        setExistedData({
          name: name ?? '',
          price: price?.toString() ?? '0',
          image,
          url,
          list: id
        })
        onClose()
      },
      onFailure() {
        setLoading('error')
      }
    })
  }

  useEffect(() => {
    if (!isOpen) {
      setProvider('')
      setUrl('')
    }
  }, [isOpen])

  useEffect(() => {
    if (url.match(/my.shp.ee/) !== null) {
      setProvider('shopee')
    } else if (url.match(/(s.lazada.com.my)|(www.lazada.com.my)/) !== null) {
      setProvider('lazada')
    } else if (url.match(/puzzleplanet.com.my/) !== null) {
      setProvider('puzzlePlanet')
    } else {
      setProvider('')
    }
  })

  return (
    <ModalWrapper isOpen={isOpen} minWidth="50vw">
      <ModalHeader
        title="Import from other apps"
        icon="tabler:apps"
        onClose={onClose}
      />
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
        <TextInput
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
            fetchData().catch(console.error)
          }}
          icon="tabler:arrow-right"
          loading={loading === 'loading'}
          iconAtEnd
          className="w-full"
        >
          Import
        </Button>
      </div>
    </ModalWrapper>
  )
}

export default FromOtherAppsModal
