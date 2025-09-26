import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { FormModal, defineForm } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import type { InferInput, InferOutput } from 'shared'

function ModifyIdeaModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: Partial<
      InferOutput<typeof forgeAPI.ideaBox.ideas.list>[number]
    >
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
          queryKey: ['ideaBox', 'misc', 'search']
        })
      },
      onError: error => {
        toast.error('Failed to modify idea:', error)
      }
    })
  )

  const { formProps } = defineForm<
    InferInput<(typeof forgeAPI.ideaBox.ideas)[typeof type]>['body']
  >({
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
        ],
        disabled: type === 'update'
      },
      content: {
        required: true,
        label: 'Idea content',
        icon: 'tabler:text-wrap',
        placeholder: 'Idea content'
      },
      link: {
        required: true,
        label: 'Idea link',
        icon: 'tabler:link',
        placeholder: 'https://example.com/your-idea'
      },
      image: {
        label: 'Idea image',
        icon: 'tabler:photo',
        optional: true,
        required: true,
        enableUrl: true
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
                                collectionId: initialData.child!.collectionId!,
                                recordId: initialData.child!.id!,
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
              }),
        tags:
          initialData.tags?.map(
            (tag: string) =>
              tagsQuery.data?.find(t => t.name === tag)?.id || tag
          ) || []
      }
    )
    .conditionalFields({
      content: data => data.type === 'text',
      link: data => data.type === 'link',
      image: data => data.type === 'image'
    })
    .onSubmit(async data => {
      data.tags =
        data.tags?.map(
          tag => tagsQuery.data?.find(t => t.id === tag)?.name || tag
        ) || []

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
