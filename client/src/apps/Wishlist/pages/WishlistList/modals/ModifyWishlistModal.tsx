import { FormModal } from 'lifeforge-ui'
import { type IFieldProps } from 'lifeforge-ui'
import { useEffect, useState } from 'react'

import {
  ISchemaWithPB,
  WishlistCollectionsSchemas
} from 'shared/types/collections'
import { WishlistControllersSchemas } from 'shared/types/controllers'

function ModifyWishlistListModal({
  data: { type, existedData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    existedData: ISchemaWithPB<WishlistCollectionsSchemas.IListAggregated> | null
  }
  onClose: () => void
}) {
  const [data, setData] = useState<
    WishlistControllersSchemas.ILists['createList' | 'updateList']['body']
  >({
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
    if (type === 'update' && existedData !== null) {
      setData({
        name: existedData.name,
        description: existedData.description,
        icon: existedData.icon,
        color: existedData.color
      })
    } else {
      setData({
        name: '',
        description: '',
        icon: '',
        color: ''
      })
    }
  }, [type, existedData])

  return (
    <FormModal
      data={data}
      endpoint="wishlist/lists"
      fields={FIELDS}
      icon={
        {
          create: 'tabler:plus',
          update: 'tabler:pencil'
        }[type!]
      }
      id={existedData?.id}
      namespace="apps.wishlist"
      openType={type}
      queryKey={['wishlist', 'lists']}
      setData={setData}
      title={`wishlist.${type}`}
      onClose={onClose}
    />
  )
}

export default ModifyWishlistListModal
