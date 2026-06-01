import type { ProxyTree } from '@lifeforge/shared'

import type { FileValue } from '@/components/inputs'

export function getFormFileFieldInitialData(
  forgeAPI: ProxyTree<any>,
  initialData: Record<string, unknown> | undefined,
  file: File | string | null | undefined
): FileValue {
  if (!file) {
    return {
      type: 'empty'
    }
  }

  if (file instanceof File) {
    const preview = file.type.startsWith('image/')
      ? URL.createObjectURL(file)
      : undefined

    return {
      type: 'upload',
      file,
      preview
    }
  }

  if (typeof file === 'string' && file.length > 0) {
    if (/^(https?|data|blob):/i.test(file)) {
      return {
        type: 'url',
        url: file,
        preview: file
      }
    }

    const api = forgeAPI as unknown as {
      getMedia: (params: {
        collectionId: string
        recordId: string
        fieldId: string
      }) => string
    }

    const preview = file.match(/^.*?(png|jpe?g|webp|gif)$/i)
      ? api.getMedia({
          collectionId: (initialData?.collectionId as string) || '',
          recordId: (initialData?.id as string) || '',
          fieldId: file
        })
      : undefined

    return {
      type: 'existing',
      id: file,
      filename: file,
      preview
    }
  }

  return {
    type: 'empty'
  }
}

export function convertFormFileFieldData(
  value: FileValue | null | undefined
): File | string | 'keep' | 'removed' {
  if (!value || value.type === 'empty') {
    return 'removed'
  }

  if (value.type === 'existing') {
    return 'keep'
  }

  if (value.type === 'upload') {
    return value.file
  }

  if (value.type === 'url') {
    return value.url
  }

  return 'removed'
}
