import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import z from 'zod'

import type { InferInput } from '@lifeforge/api'
import {
  ColorField,
  FormModal,
  IconField,
  TextAreaField,
  TextField,
  createDefaultValues
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { WishlistList } from '..'

const schema = z.object({
  name: z.string().min(1, 'Required'),
  icon: z.string().min(1, 'Required'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  description: z.string().optional()
})

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
        queryClient.invalidateQueries({
          queryKey: ['wishlist', 'lists']
        })
      }
    })
  )

  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      ...(initialData ?? { color: '#FFFFFF' })
    },
    resolver: zodResolver(schema)
  })

  return (
    <FormModal
      form={form}
      submissionConfig={{
        template: type,
        handler: async data => {
          await mutation.mutateAsync(
            data as InferInput<
              (typeof forgeAPI.wishlist.lists)[typeof type]
            >['body']
          )
        }
      }}
      uiConfig={{
        icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
        namespace: 'apps.wishlist',
        title: `wishlist.${type}`,
        onClose
      }}
    >
      <TextField
        required
        control={form.control}
        icon="tabler:list"
        label="Wishlist name"
        name="name"
        placeholder="My wishlist"
      />
      <TextAreaField
        control={form.control}
        icon="tabler:file-text"
        label="Wishlist description"
        name="description"
        placeholder="My wishlist description"
      />
      <IconField required control={form.control} label="Wishlist icon" name="icon" />
      <ColorField
        required
        control={form.control}
        label="Wishlist color"
        name="color"
      />
    </FormModal>
  )
}

export default ModifyWishlistListModal
