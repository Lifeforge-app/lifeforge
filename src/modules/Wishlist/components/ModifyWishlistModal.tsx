import { useEffect, useState } from 'react'

import { FormModal } from '@lifeforge/ui'
import { type IFieldProps } from '@lifeforge/ui'

import { type IWishlistList } from '../interfaces/wishlist_interfaces'

function ModifyWishlistListModal({
  openType,
  setOpenType,
  existedData
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  existedData: IWishlistList | null
}) {
  const [data, setData] = useState({
    name: '',
    description: '',
    icon: '',
    color: ''
  })

  const FIELDS: IFieldProps<typeof data>[] = [
    {
      id: 'name',
      required: true,
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
      required: true,
      label: 'Wishlist icon',
      type: 'icon'
    },
    {
      id: 'color',
      required: true,
      label: 'Wishlist color',
      type: 'color'
    }
  ]

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
      endpoint="wishlist/lists"
      fields={FIELDS}
      icon={
        {
          create: 'tabler:plus',
          update: 'tabler:pencil'
        }[openType!]
      }
      id={existedData?.id}
      isOpen={openType !== null}
      namespace="modules.wishlist"
      openType={openType}
      queryKey={['wishlist', 'lists']}
      setData={setData}
      title={`wishlist.${openType}`}
      onClose={() => {
        setOpenType(null)
      }}
    />
  )
}

export default ModifyWishlistListModal
