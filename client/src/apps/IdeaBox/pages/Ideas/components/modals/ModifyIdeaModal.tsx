import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import type { InferInput, InferOutput } from 'lifeforge-api'
import { FormModal, defineForm } from 'lifeforge-ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'

function ModifyIdeaModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: Partial<
      InferOutput<typeof forgeAPI.ideaBox.ideas.list>[number]
    >
    pastedData?: { file: File; preview: string }
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()

  const { t } = useTranslation('apps.ideaBox')

  const { id, '*': path } = useParams<{ id: string; '*': string }>()

  const tagsQuery = useQuery(
    forgeAPI.ideaBox.tags.list
      .input({
        container: id || ''
      })
      .queryOptions()
  )

  const [ideaType, setIdeaType] = useState<'text' | 'link' | 'image'>('text')

  const mutation = useMutation(
    (type === 'create'
      ? forgeAPI.ideaBox.ideas.create
      : forgeAPI.ideaBox.ideas.update.input({
          id: initialData?.id || ''
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['ideaBox', 'ideas']
        })
        queryClient.invalidateQueries({
          queryKey: ['ideaBox', 'search']
        })
      },
      onError: error => {
        toast.error('Failed to modify idea:', error)
      }
    })
  )

  const formProps = defineForm<
    InferInput<(typeof forgeAPI.ideaBox.ideas)[typeof type]>['body']
  >()
    .ui({
      icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
      title: `idea.${type}`,
      onClose,
      namespace: 'apps.ideaBox',
      loading: tagsQuery.isLoading,
      submitButton: type
    })
    .typesMap({
      content: 'textarea',
      link: 'text',
      image: 'file',
      type: 'listbox',
      folder: 'text',
      container: 'text',
      tags: 'listbox'
    })
    .setupFields({
      type: {
        multiple: false,
        required: true,
        label: 'Idea type',
        icon: 'tabler:category',
        options: [
          {
            value: 'text',
            text: t('entryType.text'),
            icon: 'tabler:text-size'
          },
          { value: 'link', text: t('entryType.link'), icon: 'tabler:link' },
          { value: 'image', text: t('entryType.image'), icon: 'tabler:photo' }
        ]
      },
      content: {
        required: true,
        label: 'Idea content',
        icon: 'tabler:text-wrap',
        placeholder: 'Idea content',
        hidden: ideaType !== 'text'
      },
      link: {
        required: true,
        label: 'Idea link',
        icon: 'tabler:link',
        placeholder: 'https://example.com/your-idea',
        hidden: ideaType !== 'link'
      },
      image: {
        label: 'Idea image',
        icon: 'tabler:photo',
        optional: true,
        required: true,
        enableUrl: true,
        hidden: ideaType !== 'image'
      },
      tags: {
        multiple: true,
        label: 'Idea Tags',
        icon: 'tabler:tags',
        options:
          tagsQuery.data?.map(tag => ({
            text: tag.name,
            value: tag.id,
            icon: tag.icon || 'tabler:tag',
            color: tag.color || 'gray'
          })) || [],
        placeholder: 'Select or create tags'
      }
    })
    .initialData(
      initialData && {
        type: (initialData.type as 'text' | 'link' | 'image') ?? 'text',
        ...(initialData.type === 'text'
          ? { content: initialData.content }
          : initialData.type === 'link'
            ? { link: initialData.link }
            : {
                image:
                  initialData.type === 'image'
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
                            ? forgeAPI.media.input({
                                collectionId: initialData.collectionId!,
                                recordId: initialData.id!,
                                fieldId: initialData.image
                              }).endpoint
                            : (initialData.image as File | undefined) instanceof
                                File
                              ? URL.createObjectURL(
                                  initialData.image as unknown as File
                                )
                              : null
                          : null
                      }
                    : undefined
              })
      }
    )
    .onChange(({ type }) => {
      setIdeaType(type)
    })
    .onSubmit(async data => {
      switch (data.type) {
        case 'text':
          await mutation.mutateAsync({
            content: data.content.trim(),
            type: 'text',
            folder: path?.split('/').pop() ?? '',
            container: id ?? '',
            tags: data.tags,
            image: data.image
          })
          break
        case 'link':
          await mutation.mutateAsync({
            link: data.link.trim(),
            type: 'link',
            folder: path?.split('/').pop() ?? '',
            container: id ?? '',
            tags: data.tags,
            image: data.image
          })
          break
        case 'image':
          await mutation.mutateAsync({
            type: 'image',
            folder: path?.split('/').pop() ?? '',
            container: id ?? '',
            tags: data.tags,
            image: data.image
          })
      }
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyIdeaModal
