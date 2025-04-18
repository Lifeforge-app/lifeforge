import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'

import {
  Button,
  ListboxOrComboboxInput,
  ListboxOrComboboxOption,
  ModalHeader,
  ModalWrapper,
  TextInput
} from '@lifeforge/ui'

import fetchAPI from '@utils/fetchAPI'

import { type IWishlistEntry } from '../../../interfaces/wishlist_interfaces'

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
}) {
  const { id } = useParams<{ id: string }>()
  const [provider, setProvider] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState<'loading' | 'error' | false>(false)

  async function fetchData() {
    setLoading('loading')

    try {
      const data = await fetchAPI<{
        name: string
        price: number
        image: string
      }>('wishlist/entries/external', {
        method: 'POST',
        body: {
          provider,
          url
        }
      })

      const { name, price, image } = data
      setModifyEntryModalOpenType('create')
      setExistedData({
        name: name ?? '',
        price: price ?? 0,
        image,
        url,
        list: id
      })
      onClose()
    } catch {
      toast.error('Failed to import product')
      setLoading('error')
    } finally {
      setLoading(false)
    }
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
        icon="tabler:apps"
        namespace="apps.wishlist"
        title="Import from other apps"
        onClose={onClose}
      />
      <div className="space-y-4">
        <ListboxOrComboboxInput
          buttonContent={
            <>
              <Icon
                className="size-5"
                icon={
                  PROVIDERS.find(l => l.id === provider)?.icon ??
                  'tabler:apps-off'
                }
                style={{
                  color: PROVIDERS.find(l => l.id === provider)?.color
                }}
              />
              <span className="-mt-px block truncate">
                {PROVIDERS.find(l => l.id === provider)?.name ?? 'None'}
              </span>
            </>
          }
          icon="tabler:apps"
          name="Provider"
          namespace="apps.wishlist"
          setValue={setProvider}
          type="listbox"
          value={provider}
        >
          {PROVIDERS.map(({ name, color, id, icon }, i) => (
            <ListboxOrComboboxOption
              key={i}
              color={color}
              icon={icon}
              text={name}
              value={id}
            />
          ))}
        </ListboxOrComboboxInput>
        <TextInput
          darker
          icon="tabler:link"
          name="Product URL"
          namespace="apps.wishlist"
          placeholder={
            provider === 'shopee'
              ? 'https://my.shp.ee/....'
              : 'https://s.lazada.com.my/....'
          }
          setValue={setUrl}
          value={url}
        />
        <Button
          iconAtEnd
          className="w-full"
          icon="tabler:arrow-right"
          loading={loading === 'loading'}
          onClick={() => {
            fetchData().catch(console.error)
          }}
        >
          Import
        </Button>
      </div>
    </ModalWrapper>
  )
}

export default FromOtherAppsModal
