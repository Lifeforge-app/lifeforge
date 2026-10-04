import type { FileReference, ProxyTree } from '@lifeforge/api'

import type { FileValue } from '@/components/inputs'

function isFileReference(file: unknown): file is FileReference {
  return typeof file === 'object' && file !== null && 'key' in file
}

export function getFormFileFieldInitialData(
  forgeAPI: ProxyTree<any>,
  initialData: Record<string, unknown> | undefined,
  file: File | string | FileReference | null | undefined
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

  if (isFileReference(file)) {
    const preview = file.mimeType?.startsWith('image/')
      ? forgeAPI.getMedia({ key: file.key })
      : undefined

    return {
      type: 'existing',
      id: file.key,
      filename: file.originalName ?? file.key.split('/').pop() ?? file.key,
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
      getMedia: (params: { key: string }) => string
    }

    const preview = /\.(png|jpe?g|webp|gif)$/i.test(file)
      ? api.getMedia({ key: file })
      : undefined

    return {
      type: 'existing',
      id: file,
      filename: file.split('/').pop() ?? file,
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
