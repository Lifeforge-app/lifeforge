import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import type { InferInput } from 'lifeforge-api'
import { defineForm } from 'lifeforge-ui'

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

  const mutation = useMutation(
    (type === 'create'
      ? forgeAPI.wishlist.entries.create
      : forgeAPI.wishlist.entries.update.input({
          id: initialData!.id!
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['wishlist'] })
      }
    })
  )

  const listsQuery = useQuery(forgeAPI.wishlist.lists.list.queryOptions())

  const Form = defineForm<
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
        icon: 'tabler:photo'
      }
    })
    .initialData({
      ...initialData,
      image: {
        file: initialData?.image
          ? forgeAPI.media.input({
              collectionId: initialData.collectionId!,
              recordId: initialData.id!,
              fieldId: 'image'
            }).endpoint
          : null,
        preview: initialData?.image
          ? forgeAPI.media.input({
              collectionId: initialData.collectionId!,
              recordId: initialData.id!,
              fieldId: 'image'
            }).endpoint
          : null
      }
    })
    .onSubmit(async data => {
      await mutation.mutateAsync(data)
    })

  return <Form />
}

export default ModifyEntryModal
