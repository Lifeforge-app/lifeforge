import { forgeAPI } from '@/manifest'

export default function getFormFileFieldInitialData(
  initialData: any,
  file: File | string | null | undefined
) {
  if (!file) {
    return {
      file: null,
      preview: null
    }
  }

  let finalFile

  if (typeof file === 'string' && file.length > 0) {
    // Keep existing file reference
    finalFile = 'keep'
  } else if ((file as File | undefined) instanceof File) {
    // New file uploaded
    finalFile = file
  } else {
    // Just a fallback
    finalFile = null
  }

  let preview: string | null = null

  if (typeof file === 'string') {
    // Generate preview URL for existing file
    preview = forgeAPI.getMedia({
      collectionId: initialData.collectionId!,
      recordId: initialData.id!,
      fieldId: file
    })
  } else if (file instanceof File) {
    if (file.type.startsWith('image/')) {
      // Generate preview URL for new image file
      preview = URL.createObjectURL(file)
    }
  }

  return {
    file: finalFile,
    preview
  }
}
