import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import z from 'zod'

import {
  FileField,
  FormModal,
  ListboxField,
  TextField,
  convertFormFileFieldData,
  createDefaultValues,
  fileValueSchema,
  getFormFileFieldInitialData,
  toast
} from '@lifeforge/ui'

import forgeAPI from '@/core/utils/forgeAPI'

import type { CustomFont } from '..'
import { detectFontMetadata } from '../../../../../utils/detectFontMetadata'

const schema = z.object({
  displayName: z.string().min(1, 'Display name is required'),
  family: z.string().min(1, 'Font family is required'),
  weight: z.number().int().gte(100).lte(900),
  file: fileValueSchema.refine(
    v => v.type === 'existing' || v.type === 'upload',
    'A font file must be selected or already uploaded'
  )
})

const WEIGHT_OPTIONS = [
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
        onError: err => {
          console.error(err)
          toast.error(`Failed to upload custom font: ${err.message}`)
        }
      })
  )
  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      ...initialData,
      file: getFormFileFieldInitialData(
        forgeAPI,
        initialData,
        initialData?.file
      ),
      weight: initialData?.weight ?? 400
    },
    mode: 'all',
    resolver: zodResolver(schema)
  })

  const autoDetectFontMetadata = async () => {
    const currentFile = form.getValues('file')

    if (currentFile.type !== 'upload') {
      return
    }

    if (!currentFile?.file || !(currentFile.file instanceof File)) {
      form.setValue('family', '', { shouldValidate: true })
      form.setValue('weight', 500, { shouldValidate: true })
      form.setValue('displayName', 'metadata.family', {
        shouldValidate: true
      })

      return
    }

    try {
      const metadata = await detectFontMetadata(currentFile.file)

      form.setValue('family', metadata.family, { shouldValidate: true })
      form.setValue('weight', metadata.weight, { shouldValidate: true })
      form.setValue('displayName', metadata.family, {
        shouldValidate: true
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

  return (
    <FormModal
      form={form}
      submissionConfig={{
        handler: async formData => {
          if (!formData.file) {
            throw new Error('Please select a font file')
          }

          await uploadMutation.mutateAsync({
            displayName: formData.displayName,
            family: formData.family,
            weight: formData.weight || 400,
            file: convertFormFileFieldData(formData.file)
          })
        },
        template: openType === 'create' ? 'create' : 'update'
      }}
      uiConfig={{
        icon: openType === 'create' ? 'tabler:upload' : 'tabler:pencil',
        namespace: 'common.personalization',
        title: `fontFamily.modals.customFonts.${openType === 'create' ? 'upload' : 'edit'}`,
        onClose
      }}
    >
      <FileField
        required
        control={form.control}
        icon="tabler:file-typography"
        label="fontFamily.inputs.fontFile"
        mimeTypes={{
          font: ['ttf', 'otf', 'woff', 'woff2']
        }}
        name="file"
        onChange={autoDetectFontMetadata}
      />
      <TextField
        required
        actionButtonProps={{
          icon: 'tabler:wand',
          onClick: autoDetectFontMetadata
        }}
        control={form.control}
        icon="tabler:tag"
        label="fontFamily.inputs.displayName"
        name="displayName"
        placeholder="My Custom Font"
      />
      <TextField
        required
        control={form.control}
        icon="tabler:typography"
        label="fontFamily.inputs.fontFamily"
        name="family"
        placeholder="MyFont-Regular"
      />
      <ListboxField
        control={form.control}
        icon="tabler:bold"
        label="fontFamily.inputs.fontWeight"
        name="weight"
        options={WEIGHT_OPTIONS}
      />
    </FormModal>
  )
}

export default CustomFontUploadModal
