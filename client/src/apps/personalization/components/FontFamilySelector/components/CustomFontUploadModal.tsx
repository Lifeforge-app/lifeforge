import forgeAPI from '@/utils/forgeAPI'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FormModal, defineForm } from 'lifeforge-ui'
import { toast } from 'react-toastify'
import { type InferInput, getFormFileFieldInitialData } from 'shared'

import { detectFontMetadata } from '../utils/detectFontMetadata'
import type { CustomFont } from './FontFamilySelectorModal/tabs/CustomFontSelector'

function CustomFontUploadModal({
  onClose,
  data: { openType, initialData }
}: {
  onClose: () => void
  data: { openType: 'create' | 'edit'; initialData?: CustomFont }
}) {
  const queryClient = useQueryClient()

  const uploadMutation = useMutation(
    forgeAPI.user.customFonts.upload
      .input({
        id: openType === 'edit' && initialData ? initialData.id : undefined
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['user', 'customFonts', 'list']
          })
          toast.success('Custom font uploaded successfully!')
          onClose()
        },
        onError: () => {
          toast.error('Failed to upload custom font')
        }
      })
  )

  const { formProps, formStateStore } = defineForm<
    InferInput<typeof forgeAPI.user.customFonts.upload>['body']
  >({
    icon: openType === 'create' ? 'tabler:upload' : 'tabler:edit',
    title: `fontFamily.modals.customFonts.${openType === 'create' ? 'upload' : 'edit'}`,
    namespace: 'apps.personalization',
    onClose,
    submitButton: 'create'
  })
    .typesMap({
      file: 'file',
      displayName: 'text',
      family: 'text',
      weight: 'listbox'
    })
    .setupFields({
      file: {
        optional: false,
        icon: 'tabler:file-typography',
        label: 'fontFamily.inputs.fontFile',
        required: true,
        acceptedMimeTypes: {
          'font/*': ['ttf', 'otf', 'woff', 'woff2']
        }
      },
      displayName: {
        icon: 'tabler:tag',
        label: 'fontFamily.inputs.displayName',
        placeholder: 'My Custom Font',
        required: true,
        actionButtonProps: {
          icon: 'tabler:wand',
          onClick: async () => {
            const currentState = formStateStore.getState()

            if (
              !(currentState.file as any).file ||
              !((currentState.file as any).file instanceof File)
            ) {
              toast.error('Please select a font file first')

              return
            }

            try {
              const metadata = await detectFontMetadata(
                (currentState.file as any).file
              )

              formStateStore.setState({
                family: metadata.family,
                weight: metadata.weight,
                displayName: metadata.family
              })

              toast.success('Font metadata detected successfully!')
            } catch (error) {
              toast.error(
                error instanceof Error
                  ? error.message
                  : 'Failed to detect font metadata'
              )
            }
          }
        }
      },
      family: {
        icon: 'tabler:typography',
        label: 'fontFamily.inputs.fontFamily',
        placeholder: 'MyFont-Regular',
        required: true
      },
      weight: {
        icon: 'tabler:bold',
        label: 'fontFamily.inputs.fontWeight',
        multiple: false,
        options: [
          { text: 'Thin (100)', value: 100 },
          { text: 'Extra Light (200)', value: 200 },
          { text: 'Light (300)', value: 300 },
          { text: 'Regular (400)', value: 400 },
          { text: 'Medium (500)', value: 500 },
          { text: 'Semi-Bold (600)', value: 600 },
          { text: 'Bold (700)', value: 700 },
          { text: 'Extra Bold (800)', value: 800 },
          { text: 'Black (900)', value: 900 }
        ]
      }
    })
    .initialData({
      ...initialData,
      file: getFormFileFieldInitialData(
        forgeAPI,
        initialData,
        initialData?.file
      ),
      weight: initialData?.weight ?? 400
    })
    .onSubmit(async formData => {
      if (!formData.file || !(formData.file instanceof File)) {
        throw new Error('Please select a font file')
      }

      await uploadMutation.mutateAsync({
        displayName: formData.displayName,
        family: formData.family,
        weight: formData.weight,
        file: formData.file
      })
    })
    .build()

  return <FormModal {...formProps} />
}

export default CustomFontUploadModal
