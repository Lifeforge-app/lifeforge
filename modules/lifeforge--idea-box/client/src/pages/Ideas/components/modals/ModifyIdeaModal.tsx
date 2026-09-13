import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router'
import z from 'zod'

import type { InferOutput } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  FileField,
  FormModal,
  ListboxField,
  TextAreaField,
  TextField,
  createDefaultValues
} from '@lifeforge/ui'
import { toast } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

const schema = z.object({
  type: z.enum(['text', 'link', 'image']),
  content: z.string().optional(),
  link: z.string().optional(),
  image: z
    .object({
      file: z.any(),
      preview: z.string().nullable()
    })
    .nullable()
    .optional(),
  folder: z.string().optional(),
  container: z.string().optional(),
  tags: z.array(z.string()).optional()
})

function ModifyIdeaModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: Partial<InferOutput<typeof forgeAPI.ideas.list>[number]> & {
      isPasted?: boolean
    }
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const { t } = useModuleTranslation()
  const { id, '*': path } = useParams<{ id: string; '*': string }>()

  const tagsQuery = useQuery(
    forgeAPI.tags.list
      .input({
        container: id || ''
      })
      .queryOptions()
  )

  const mutation = useMutation(
    (type === 'create'
      ? forgeAPI.ideas.create
      : forgeAPI.ideas.update.input({
          id: initialData?.id || ''
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['ideaBox', 'ideas']
        })
        queryClient.invalidateQueries({
          queryKey: ['ideaBox', 'misc', 'search']
        })
      },
      onError: error => {
        toast.error('Failed to modify idea:', error)
      }
    })
  )

  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      type:
        (initialData?.type as 'text' | 'link' | 'image') ?? ('text' as const),
      ...(initialData?.type === 'text'
        ? { content: initialData.content }
        : initialData?.type === 'link'
          ? { link: initialData.link }
          : {
              image:
                initialData?.type === 'image'
                  ? {
                      file:
                        typeof initialData.image === 'string' &&
                        initialData.image.length > 0
                          ? 'keep'
                          : (initialData.image as unknown as File) instanceof
                              File
                            ? (initialData.image as unknown as File)
                            : null,
                      preview: initialData.image
                        ? typeof initialData.image === 'string'
                          ? forgeAPI.getMedia({
                              collectionId: initialData.child!.collectionId!,
                              recordId: initialData.child!.id!,
                              fieldId: initialData.image
                            })
                          : (initialData.image as File | undefined) instanceof
                              File
                            ? URL.createObjectURL(
                                initialData.image as unknown as File
                              )
                            : null
                        : null
                    }
                  : undefined
            }),
      tags:
        initialData?.tags?.map(
          (tag: string) =>
            tagsQuery.data?.find(t => t.name === tag)?.id || tag
        ) || []
    },
    resolver: zodResolver(schema)
  })

  const ideaType = form.watch('type')

  useEffect(() => {
    if (initialData?.isPasted && mutation.isIdle) {
      mutation
        .mutateAsync({
          type: 'image',
          folder: path?.split('/').pop() ?? '',
          container: id ?? '',
          tags: initialData.tags || [],
          image:
            //@ts-expect-error - Lazy to fix
            initialData.image instanceof File ? initialData.image : undefined
        })
        .then(() => {
          onClose()
        })
    }
  }, [initialData])

  return (
    <FormModal
      form={form}
      submissionConfig={{
        template: type,
        handler: async data => {
          const tags =
            data.tags?.map(
              tag => tagsQuery.data?.find(t => t.id === tag)?.name || tag
            ) || []

          switch (data.type) {
            case 'text':
              await mutation.mutateAsync({
                content: (data.content || '').trim(),
                type: 'text',
                folder: path?.split('/').pop() ?? '',
                container: id ?? '',
                tags,
                image: data.image
              })
              break
            case 'link':
              await mutation.mutateAsync({
                link: (data.link || '').trim(),
                type: 'link',
                folder: path?.split('/').pop() ?? '',
                container: id ?? '',
                tags,
                image: data.image
              })
              break
            case 'image':
              await mutation.mutateAsync({
                type: 'image',
                folder: path?.split('/').pop() ?? '',
                container: id ?? '',
                tags,
                image: data.image
              })
          }
        }
      }}
      uiConfig={{
        icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
        namespace: 'apps.ideaBox',
        title: `idea.${type}`,
        onClose,
        loading: tagsQuery.isLoading
      }}
    >
      <ListboxField
        required
        control={form.control}
        icon="tabler:category"
        label="Idea type"
        name="type"
        multiple={false}
        disabled={type === 'update'}
        options={[
          {
            value: 'text' as const,
            text: t('entryType.text'),
            icon: 'tabler:text-size'
          },
          {
            value: 'link' as const,
            text: t('entryType.link'),
            icon: 'tabler:link'
          },
          {
            value: 'image' as const,
            text: t('entryType.image'),
            icon: 'tabler:photo'
          }
        ]}
      />
      {ideaType === 'text' && (
        <TextAreaField
          required
          control={form.control}
          icon="tabler:text-wrap"
          label="Idea content"
          name="content"
          placeholder="Idea content"
        />
      )}
      {ideaType === 'link' && (
        <TextField
          required
          control={form.control}
          icon="tabler:link"
          label="Idea link"
          name="link"
          placeholder="https://example.com/your-idea"
        />
      )}
      {ideaType === 'image' && (
        <FileField
          required
          control={form.control}
          icon="tabler:photo"
          label="Idea image"
          name="image"
        />
      )}
      <ListboxField
        control={form.control}
        icon="tabler:tags"
        label="Idea Tags"
        name="tags"
        multiple
        options={
          tagsQuery.data?.map(tag => ({
            text: tag.name,
            value: tag.id,
            icon: tag.icon || 'tabler:tag',
            color: tag.color || 'gray'
          })) || []
        }
      />
    </FormModal>
  )
}

export default ModifyIdeaModal
