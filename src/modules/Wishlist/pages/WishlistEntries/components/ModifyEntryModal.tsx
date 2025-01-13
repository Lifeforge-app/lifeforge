/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { t } from 'i18next'
import React, { useEffect, useReducer } from 'react'
import { toast } from 'react-toastify'
import Modal from '@components/Modals/Modal'
import { type IFieldProps } from '@interfaces/modal_interfaces'
import {
  type IWishlistList,
  type IWishlistEntry
} from '@interfaces/wishlist_interfaces'
import APIRequest from '@utils/fetchData'

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
  setEntries: React.Dispatch<
    React.SetStateAction<IWishlistEntry[] | 'loading' | 'error'>
  >
  existedData: IWishlistEntry | null
  collectionId: string
  lists: IWishlistList[] | 'loading' | 'error'
}): React.ReactElement {
  const [data, setData] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      list: '',
      url: '',
      name: '',
      price: '',
      image: {
        image: null as File | string | null,
        preview: null as string | null
      }
    }
  )

  const FIELDS: IFieldProps[] = [
    {
      id: 'list',
      label: 'Wishlist',
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

  function updateDataList(data: IWishlistEntry | 'removed'): void {
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

  async function onSubmitButtonClick(): Promise<void> {
    const { list, url, name, price, image } = data
    if (
      list.trim().length === 0 ||
      url.trim().length === 0 ||
      name.trim().length === 0 ||
      price.trim().length === 0 ||
      image === null
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
      'imageRemoved',
      existedData?.image !== '' &&
        image.image === null &&
        image.preview === null
        ? 'true'
        : 'false'
    )

    await APIRequest({
      endpoint:
        'wishlist/entries' +
        (openType === 'update' ? `/${existedData?.id}` : ''),
      method: openType === 'create' ? 'POST' : 'PATCH',
      body: formData,
      isJSON: false,
      successInfo: openType,
      failureInfo: openType,
      callback: res => {
        setOpenType(null)
        updateDataList(res.data)
      },
      onFailure: () => {
        setOpenType(null)
      }
    })
  }

  useEffect(() => {
    if (openType === 'update' && existedData !== null) {
      setData({
        ...existedData,
        price: existedData.price.toString(),
        image: {
          image: null,
          preview:
            existedData.image !== ''
              ? `${import.meta.env.VITE_API_HOST}/media/${collectionId}/${
                  existedData.id
                }/${existedData.image}`
              : null
        }
      })
    } else {
      setData({
        list: '',
        name: '',
        icon: '',
        color: '',
        cover: {
          image: null,
          preview: null
        }
      })
    }
  }, [openType, existedData])

  return (
    <Modal
      isOpen={openType !== null}
      fields={FIELDS}
      data={data}
      setData={setData}
      title={`${
        {
          create: 'Create ',
          update: 'Update '
        }[openType!]
      } container`}
      icon={
        {
          create: 'tabler:plus',
          update: 'tabler:pencil'
        }[openType!]
      }
      openType={openType}
      onClose={() => {
        setOpenType(null)
      }}
      onSubmit={onSubmitButtonClick}
    />
  )
}

export default ModifyEntryModal
