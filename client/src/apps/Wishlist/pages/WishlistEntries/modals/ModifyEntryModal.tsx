import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import type { InferInput } from 'lifeforge-api'
import { FormModal, defineForm } from 'lifeforge-ui'
import { useState } from 'react'
import { toast } from 'react-toastify'

import type { WishlistEntry } from '..'

function ModifyEntryModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: Partial<WishlistEntry>
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()

  const [fileRemoved, setFileRemoved] = useState(false)

  const mutation = useMutation(
    (type === 'create'
      ? forgeAPI.wishlist.entries.create
      : forgeAPI.wishlist.entries.update.input({
          id: initialData!.id!
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['wishlist'] })
      },
      onError: () => {
        toast.error(`Failed to ${type} entry`)
      }
    })
  )

  const listsQuery = useQuery(forgeAPI.wishlist.lists.list.queryOptions())

  const formProps = defineForm<
    InferInput<(typeof forgeAPI.wishlist.entries)[typeof type]>['body']
  >()
    .ui({
      title: `entry.${type}`,
      namespace: 'apps.wishlist',
      onClose,
      icon: {
        create: 'tabler:plus',
        update: 'tabler:pencil'
      }[type!],
      submitButton: type
    })
    .typesMap({
      list: 'listbox',
      url: 'text',
      name: 'text',
      price: 'currency',
      image: 'file'
    })
    .setupFields({
      list: {
        multiple: false,
        required: true,
        label: 'Wishlist Name',
        icon: 'tabler:list',
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
      url: {
        label: 'Product URL',
        icon: 'tabler:link',
        placeholder: 'https://example.com'
      },
      name: {
        required: true,
        label: 'Product Name',
        icon: 'tabler:tag',
        placeholder: 'Product name'
      },
      price: {
        label: 'Product Price',
        icon: 'tabler:currency-dollar'
      },
      image: {
        label: 'Product Image',
        optional: true,
        icon: 'tabler:photo',
        onFileRemoved: () => {
          setFileRemoved(true)
        }
      }
    })
    .initialData({
      ...initialData,
      image: {
        file: initialData?.image
          ? forgeAPI.media.input({
              collectionId: initialData.collectionId!,
              recordId: initialData.id!,
              fieldId: initialData.image!
            }).endpoint
          : null,
        preview: initialData?.image
          ? forgeAPI.media.input({
              collectionId: initialData.collectionId!,
              recordId: initialData.id!,
              fieldId: initialData.image!
            }).endpoint
          : null
      }
    })
    .onSubmit(async data => {
      if (fileRemoved) {
        data.image = 'removed'
      }

      await mutation.mutateAsync(data)
    })

  return <FormModal {...formProps} />
}

export default ModifyEntryModal
