import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'

import type { InferInput } from '@lifeforge/api'
import {
  CurrencyField,
  FileField,
  FormModal,
  ListboxField,
  TextField,
  createDefaultValues
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { WishlistEntry } from '..'

const schema = z.object({
  list: z.string().min(1, 'Required'),
  url: z.string().optional(),
  name: z.string().min(1, 'Required'),
  price: z.number().optional(),
  image: z
    .object({
      file: z.any(),
      preview: z.string().nullable()
    })
    .nullable()
    .optional()
})

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
          id: initialData?.id || ''!
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

  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      ...(initialData ?? {}),
      list: initialData?.collectionId ?? '',
      image: initialData?.image
        ? {
            file: forgeAPI.media.input({
              collectionId: initialData.collectionId!,
              recordId: initialData.id!,
              fieldId: initialData.image!
            }).endpoint,
            preview: forgeAPI.media.input({
              collectionId: initialData.collectionId!,
              recordId: initialData.id!,
              fieldId: initialData.image!
            }).endpoint
          }
        : null
    },
    resolver: zodResolver(schema)
  })

  return (
    <FormModal
      form={form}
      submissionConfig={{
        template: type,
        handler: async data => {
          if (fileRemoved) {
            ;(data as any).image = 'removed'
          }

          await mutation.mutateAsync(
            data as InferInput<
              (typeof forgeAPI.wishlist.entries)[typeof type]
            >['body']
          )
        }
      }}
      uiConfig={{
        icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
        namespace: 'apps.wishlist',
        title: `entry.${type}`,
        onClose
      }}
    >
      <ListboxField
        required
        control={form.control}
        icon="tabler:list"
        label="Wishlist Name"
        name="list"
        multiple={false}
        options={
          listsQuery.isLoading || !listsQuery.data
            ? []
            : listsQuery.data.map(list => ({
                value: list.id,
                text: list.name,
                icon: list.icon,
                color: list.color
              }))
        }
      />
      <TextField
        control={form.control}
        icon="tabler:link"
        label="Product URL"
        name="url"
        placeholder="https://example.com"
      />
      <TextField
        required
        control={form.control}
        icon="tabler:tag"
        label="Product Name"
        name="name"
        placeholder="Product name"
      />
      <CurrencyField
        control={form.control}
        icon="tabler:currency-dollar"
        label="Product Price"
        name="price"
      />
      <FileField
        control={form.control}
        icon="tabler:photo"
        label="Product Image"
        name="image"
        onFileRemove={() => {
          setFileRemoved(true)
        }}
      />
    </FormModal>
  )
}

export default ModifyEntryModal
