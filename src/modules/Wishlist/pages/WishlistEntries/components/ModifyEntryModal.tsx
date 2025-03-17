import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { FormModal } from '@lifeforge/ui'
import { type IFieldProps } from '@lifeforge/ui'

import { type Loadable } from '@interfaces/common'

import fetchAPI from '@utils/fetchAPI'

import {
  type IWishlistEntry,
  type IWishlistList
} from '../../../interfaces/wishlist_interfaces'

function ModifyEntryModal({
  openType,
  setOpenType,
  setEntries,
  existedData,
  collectionId,
  lists
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  setEntries: React.Dispatch<React.SetStateAction<Loadable<IWishlistEntry[]>>>
  existedData: Partial<IWishlistEntry> | null
  collectionId: string
  lists: Loadable<IWishlistList[]>
}) {
  const { t } = useTranslation('modules.wishlist')
  const [data, setData] = useState({
    list: '',
    url: '',
    name: '',
    price: '',
    image: {
      image: null as File | string | null,
      preview: null as string | null
    }
  })

  const FIELDS: IFieldProps<typeof data>[] = [
    {
      id: 'list',
      label: 'Wishlist Name',
      icon: 'tabler:list',
      type: 'listbox',
      options:
        typeof lists === 'string'
          ? []
          : lists.map(list => ({
              value: list.id,
              text: list.name,
              icon: list.icon,
              color: list.color
            }))
    },
    {
      id: 'url',
      label: 'Product URL',
      icon: 'tabler:link',
      placeholder: 'https://example.com',
      type: 'text'
    },
    {
      id: 'name',
      label: 'Product Name',
      icon: 'tabler:tag',
      placeholder: 'Product name',
      type: 'text'
    },
    {
      id: 'price',
      label: 'Product Price',
      icon: 'tabler:currency-dollar',
      placeholder: '0.00',
      type: 'text'
    },
    {
      id: 'image',
      label: 'Product Image',
      type: 'file'
    }
  ]

  function updateDataList(data: IWishlistEntry | 'removed') {
    if (openType === 'update') {
      setEntries(prev => {
        if (typeof prev === 'string') {
          return prev
        }

        if (data === 'removed') {
          return prev.filter(entry => entry.id !== existedData?.id)
        }
        return prev.map(entry => (entry.id === existedData?.id ? data : entry))
      })
    } else {
      setEntries(prev => {
        if (typeof prev === 'string') {
          return prev
        }

        if (data === 'removed') {
          return prev
        }
        return [...prev, data]
      })
    }
  }

  async function onSubmitButtonClick() {
    const { list, url, name, price, image } = data
    if (
      list.trim().length === 0 ||
      url.trim().length === 0 ||
      name.trim().length === 0 ||
      price.trim().length === 0
    ) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    const formData = new FormData()
    formData.append('list', list)
    formData.append('url', url)
    formData.append('name', name)
    formData.append('price', price)
    formData.append('file', image.image instanceof File ? image.image : '')
    formData.append(
      'image',
      image.image instanceof File ? '' : (image.image ?? '')
    )
    formData.append(
      'imageRemoved',
      existedData?.image !== '' &&
        image.image === null &&
        image.preview === null
        ? 'true'
        : 'false'
    )

    try {
      const data = await fetchAPI<IWishlistEntry>(
        'wishlist/entries' +
          (openType === 'update' ? `/${existedData?.id}` : ''),
        {
          method: openType === 'create' ? 'POST' : 'PATCH',
          body: formData
        }
      )

      setOpenType(null)
      updateDataList(data)
    } catch {
      setOpenType(null)
    }
  }

  useEffect(() => {
    const newData: {
      list: string
      url: string
      name: string
      price: number
      image: {
        image: string | File | null
        preview: string | null
      }
    } = {
      list: '',
      url: '',
      name: '',
      price: 0,
      image: {
        image: null,
        preview: null
      }
    }

    if (existedData !== null) {
      for (const key in newData) {
        if (key in existedData) {
          // @ts-expect-error - lazy to fix
          newData[key] = existedData[key as keyof typeof existedData] ?? ''
        }
      }

      setData({
        ...newData,
        price: existedData.price?.toString() ?? '',
        image: {
          image:
            existedData.image?.startsWith('https://') === true
              ? existedData.image
              : null,
          preview: (() => {
            if (['', null, undefined].includes(existedData.image)) return null

            if (existedData.image?.startsWith('https://'))
              return existedData.image

            return `${import.meta.env.VITE_API_HOST}/media/${collectionId}/${
              existedData.id
            }/${existedData.image}`
          })()
        }
      })
    } else {
      setData({
        ...newData,
        price: ''
      })
    }
  }, [openType, existedData])

  return (
    <FormModal
      data={data}
      fields={FIELDS}
      icon={
        {
          create: 'tabler:plus',
          update: 'tabler:pencil'
        }[openType!]
      }
      isOpen={openType !== null}
      namespace="modules.wishlist"
      openType={openType}
      setData={setData}
      title={`entry.${openType ?? ''}`}
      onClose={() => {
        setOpenType(null)
      }}
      onSubmit={onSubmitButtonClick}
    />
  )
}

export default ModifyEntryModal
