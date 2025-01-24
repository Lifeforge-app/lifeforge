import { t } from 'i18next'
import React, { useEffect, useReducer } from 'react'
import { toast } from 'react-toastify'
import Modal from '@components/modals/Modal'
import { type IFieldProps } from '@interfaces/modal_interfaces'
import { type IWishlistList } from '@interfaces/wishlist_interfaces'
import APIRequest from '@utils/fetchData'

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
  const [data, setData] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      name: '',
      description: '',
      icon: '',
      color: ''
    }
  )

  const FIELDS: IFieldProps[] = [
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

    await APIRequest({
      endpoint:
        'wishlist/lists' + (openType === 'update' ? `/${existedData?.id}` : ''),
      method: openType === 'create' ? 'POST' : 'PATCH',
      body: wishlist,
      successInfo: openType,
      failureInfo: openType,
      callback: () => {
        setOpenType(null)
        updateWishlistList()
      },
      onFailure: () => {
        setOpenType(null)
      }
    })
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
      } wishlist`}
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

export default ModifyWishlistListModal
