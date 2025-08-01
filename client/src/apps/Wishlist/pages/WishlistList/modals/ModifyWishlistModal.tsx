import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { FormModal, defineForm } from 'lifeforge-ui'
import type { InferInput } from 'shared'

import type { WishlistList } from '..'

function ModifyWishlistListModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: WishlistList
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    (type === 'create'
      ? forgeAPI.wishlist.lists.create
      : forgeAPI.wishlist.lists.update.input({
          id: initialData?.id || ''
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['wishlist', 'lists'] })
      }
    })
  )

  const formProps = defineForm<
    InferInput<(typeof forgeAPI.wishlist.lists)[typeof type]>['body']
  >()
    .ui({
      namespace: 'apps.wishlist',
      title: `wishlist.${type}`,
      icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
      onClose,
      submitButton: type
    })
    .typesMap({
      name: 'text',
      icon: 'icon',
      color: 'color',
      description: 'textarea'
    })
    .setupFields({
      name: {
        required: true,
        label: 'Wishlist name',
        icon: 'tabler:list',
        placeholder: 'My wishlist',
        type: 'text'
      },
      description: {
        label: 'Wishlist description',
        icon: 'tabler:file-text',
        placeholder: 'My wishlist description',
        type: 'text'
      },
      icon: {
        required: true,
        label: 'Wishlist icon',
        type: 'icon'
      },
      color: {
        required: true,
        label: 'Wishlist color',
        type: 'color'
      }
    })
    .initialData(initialData)
    .onSubmit(async data => {
      await mutation.mutateAsync(data)
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyWishlistListModal
