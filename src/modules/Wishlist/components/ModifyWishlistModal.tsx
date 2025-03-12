import fetchAPI from '@utils/fetchAPI'
import React, { useEffect, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { FormModal } from '@lifeforge/ui'
import { type IFieldProps } from '@lifeforge/ui'

import { type IWishlistList } from '../interfaces/wishlist_interfaces'

function ModifyWishlistListModal({
  openType,
  setOpenType,
  updateWishlistList,
  existedData
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  updateWishlistList: () => void
  existedData: IWishlistList | null
}): React.ReactElement {
  const { t } = useTranslation('modules.wishlist')
  const [data, setData] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      name: '',
      description: '',
      icon: '',
      color: ''
    }
  )

  const FIELDS: IFieldProps<typeof data>[] = [
    {
      id: 'name',
      label: 'Wishlist name',
      icon: 'tabler:list',
      placeholder: 'My wishlist',
      type: 'text'
    },
    {
      id: 'description',
      label: 'Wishlist description',
      icon: 'tabler:file-text',
      placeholder: 'My wishlist description',
      type: 'text'
    },
    {
      id: 'icon',
      label: 'Wishlist icon',
      type: 'icon'
    },
    {
      id: 'color',
      label: 'Wishlist color',
      type: 'color'
    }
  ]

  async function onSubmitButtonClick(): Promise<void> {
    const { name, description, icon, color } = data
    if (
      name.trim().length === 0 ||
      color.trim().length === 0 ||
      icon.trim().length === 0
    ) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    const wishlist = {
      name: name.trim(),
      description: description.trim(),
      color: color.trim(),
      icon: icon.trim()
    }

    try {
      await fetchAPI(
        'wishlist/lists' + (openType === 'update' ? `/${existedData?.id}` : ''),
        {
          method: openType === 'create' ? 'POST' : 'PATCH',
          body: wishlist
        }
      )

      setOpenType(null)
      updateWishlistList()
    } catch {
      toast.error('Error')
    }
  }

  useEffect(() => {
    if (openType === 'update' && existedData !== null) {
      setData(existedData)
    } else {
      setData({
        name: '',
        description: '',
        icon: '',
        color: ''
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
      title={`wishlist.${openType}`}
      onClose={() => {
        setOpenType(null)
      }}
      onSubmit={onSubmitButtonClick}
    />
  )
}

export default ModifyWishlistListModal
