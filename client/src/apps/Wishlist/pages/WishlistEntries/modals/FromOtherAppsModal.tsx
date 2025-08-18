import { Icon } from '@iconify/react'
import forgeAPI from '@utils/forgeAPI'
import {
  Button,
  ListboxInput,
  ListboxOption,
  ModalHeader,
  TextInput
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import { usePromiseLoading } from 'shared'

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

  async function fetchData() {
    try {
      const { name, price, image } =
        await forgeAPI.wishlist.entries.scrapeExternal.mutate({
          provider,
          url
        })

      open(ModifyEntryModal, {
        type: 'create',
        initialData: {
          name,
          price,
          image,
          url,
          list: id
        }
      })
    } catch {
      toast.error('Failed to import product')
    }
  }

  const [loading, onSubmit] = usePromiseLoading(fetchData)

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
        <ListboxInput
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
          label="Provider"
          namespace="apps.wishlist"
          setValue={setProvider}
          value={provider}
        >
          {PROVIDERS.map(({ name, color, id, icon }, i) => (
            <ListboxOption
              key={i}
              color={color}
              icon={icon}
              label={name}
              value={id}
            />
          ))}
        </ListboxInput>
        <TextInput
          icon="tabler:link"
          label="Product URL"
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
          className="w-full"
          icon="tabler:arrow-right"
          iconPosition="end"
          loading={loading}
          onClick={onSubmit}
        >
          Import
        </Button>
      </div>
    </div>
  )
}

export default FromOtherAppsModal
