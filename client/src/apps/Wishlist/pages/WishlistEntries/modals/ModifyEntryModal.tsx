import { useQueryClient } from '@tanstack/react-query'
import { FormModal } from 'lifeforge-ui'
import { type IFieldProps } from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import useAPIQuery from '@hooks/useAPIQuery'

import fetchAPI from '@utils/fetchAPI'

import {
  type IWishlistEntry,
  type IWishlistList
} from '../../../interfaces/wishlist_interfaces'

function ModifyEntryModal({
  data: { type, existedData },
  onClose
}: {
  data: {
    type: 'create' | 'update' | null
    existedData: Partial<IWishlistEntry> | null
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const { t } = useTranslation('apps.wishlist')
  const listsQuery = useAPIQuery<IWishlistList[]>('wishlist/lists', [
    'wishlist',
    'lists'
  ])
  const collectionIdQuery = useAPIQuery<string>(
    'wishlist/entries/collection-id',
    ['wishlist', 'entries', 'collection-id']
  )
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
      required: true,
      label: 'Wishlist Name',
      icon: 'tabler:list',
      type: 'listbox',
      options:
        listsQuery.isLoading || !listsQuery.data
          ? []
          : listsQuery.data.map(list => ({
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
      required: true,
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
      await fetchAPI<IWishlistEntry>(
        'wishlist/entries' + (type === 'update' ? `/${existedData?.id}` : ''),
        {
          method: type === 'create' ? 'POST' : 'PATCH',
          body: formData
        }
      )

      queryClient.refetchQueries({
        queryKey: ['wishlist', 'entries']
      })
    } finally {
      onClose()

      setTimeout(() => {
        onClose()
      }, 500)
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

            return `${import.meta.env.VITE_API_HOST}/media/${collectionIdQuery.data}/${
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
  }, [type, existedData])

  return (
    <FormModal
      data={data}
      fields={FIELDS}
      icon={
        {
          create: 'tabler:plus',
          update: 'tabler:pencil'
        }[type!]
      }
      namespace="apps.wishlist"
      openType={type}
      setData={setData}
      title={`entry.${type ?? ''}`}
      onClose={onClose}
      onSubmit={onSubmitButtonClick}
    />
  )
}

export default ModifyEntryModal
