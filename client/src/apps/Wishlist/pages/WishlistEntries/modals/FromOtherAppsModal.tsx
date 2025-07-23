import { Icon } from '@iconify/react'
import {
  Button,
  ListboxOrComboboxInput,
  ListboxOrComboboxOption,
  ModalHeader,
  TextInput
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import { fetchAPI } from 'shared'

import { WishlistControllersSchemas } from 'shared/types/controllers'

import ModifyEntryModal from './ModifyEntryModal'

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

function FromOtherAppsModal({ onClose }: { onClose: () => void }) {
  const open = useModalStore(state => state.open)

  const { id } = useParams<{ id: string }>()

  const [provider, setProvider] = useState('')

  const [url, setUrl] = useState('')

  const [loading, setLoading] = useState<'loading' | 'error' | false>(false)

  async function fetchData() {
    setLoading('loading')

    try {
      const data = await fetchAPI<
        WishlistControllersSchemas.IEntries['scrapeExternal']['response']
      >(import.meta.env.VITE_API_HOST, 'wishlist/entries/external', {
        method: 'POST',
        body: {
          provider,
          url
        }
      })

      const { name, price, image } = data

      open(ModifyEntryModal, {
        type: 'create',
        existedData: {
          name,
          price,
          image,
          url,
          list: id
        }
      })
    } catch {
      toast.error('Failed to import product')
      setLoading('error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setProvider('')
    setUrl('')
  }, [])

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
  }, [url])

  return (
    <div className="min-w-[50vw]">
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
    </div>
  )
}

export default FromOtherAppsModal
